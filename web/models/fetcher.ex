# WhistlerNewsReader.Fetcher.import_feeds
# WhistlerNewsReader.Fetcher.refresh_all
defmodule WhistlerNewsReader.Fetcher do

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo

  def refresh_all do
    Enum.each(Repo.all(Feed), fn(feed) ->
      refresh(feed)
    end)
  end

  def refresh(feed) do
    IO.puts "Refresh #{feed.title}"

    {:ok, json_body}   = fetch(feed.feed_url)
    parsed_feed = parse_feed(json_body)

    Enum.each(parsed_feed.entries, fn(entry) ->
      case store_entry(feed, entry) do
        {:ok, _new_entry} ->
          IO.puts "Updated successfully"
        {:skipping} ->
          IO.puts "Skipping entry"
        {:error, changeset} ->
          IO.puts "Update failed: #{inspect changeset.errors}"
      end
    end)
  end

  # TODO: implement OPML import instead of fixed url list
  def import_feeds() do
    urls = [
      "http://heise.de.feedsportal.com/c/35207/f/653902/index.rss",
      "http://www.theverge.com/rss/frontpage"
    ]

    Repo.delete_all(Feed)
    Repo.delete_all(Entry)

    Enum.each(urls, fn(feed_url) -> import_feed_with_content(feed_url) end)
  end

  def import_feed(feed_url) do
    IO.puts(feed_url)

    case fetch(feed_url) do
      {:ok, json_body} ->
        feed = parse_feed(json_body)
        store_feed(feed_url, feed)
      {:error, error}  -> {:error, error.reason} # HTTPoison.Error
    end
  end

  defp import_feed_with_content(feed_url) do
    IO.puts(feed_url)

    {:ok, json_body}   = fetch(feed_url)
    feed               = parse_feed(json_body)
    {:ok, stored_feed} = store_feed(feed_url, feed)

    Enum.each(feed.entries, fn(entry) -> store_entry(stored_feed, entry) end)
  end

  defp store_entry(feed, entry) do
    published = entry[:updated] |> convert_to_ecto_date_time
    guid = generate_guid(feed.feed_url, entry[:id], published, entry[:title])
    text_content = Floki.text(entry[:content] || entry[:description])

    result = %{
      feed_id: feed.id,
      guid: guid,
      title: entry[:title],
      author: entry[:author],
      url: entry[:url],
      summary: entry[:summary] || String.slice(text_content, 0..255),
      content: entry[:content] || entry[:description],
      published: published
    }

    case Entry |> Entry.for_guid(guid) |> Repo.all do
      [] ->
        Repo.insert(Entry.changeset(%Entry{}, result))
      _ ->
        {:skipping}
    end
  end

  defp convert_to_ecto_date_time(date_time) do
    %Ecto.DateTime{
      year: date_time.year, month: date_time.month, day: date_time.day,
      hour: date_time.hour, min: date_time.min, sec: date_time.sec, usec: date_time.usec
    }
  end

  # generate unique guid since in RSS/Atom entries the guid ist not alwasy unique
  defp generate_guid(feed_url, entry_guid, entry_published, entry_title) do
    unique_id_str = "#{feed_url}#{entry_guid}#{entry_published}#{entry_title}"
    :crypto.hash(:sha256, unique_id_str) |> Base.encode16
  end

  # TODO: store feed.last_build_date
  defp store_feed(feed_url, feed) do
    changeset = Feed.changeset(%Feed{}, %{
      title: feed.title,
      feed_url: feed_url,
      site_url: feed.url
    })
    Repo.insert(changeset)
  end

  defp fetch(url) do
    IO.puts "fetching feed #{url}"

    HTTPoison.start
    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{body: body}} -> {:ok, body}
      {:error, reason}                       -> {:error, reason}
    end
  end

  defp parse_feed(xml_body) do
    ElixirFeedParser.parse(xml_body)
  end

end
