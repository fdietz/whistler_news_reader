defmodule WhistlerNewsReader.Fetcher do

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo

  require Logger

  def refresh_all(feeds) do
    Enum.each(feeds, fn(feed) ->
      refresh(feed)
    end)
  end

  def refresh(feed) do
    Logger.info "Refresh feed id: #{feed.id}, title: #{feed.title}"

    {:ok, json_body}   = fetch(feed.feed_url)
    parsed_feed        = parse_feed(json_body)

    Enum.each(parsed_feed.entries, fn(entry) ->
      case store_entry(feed, entry) do
        {:ok, _new_entry} ->
          Logger.info "Refresh feed id: #{feed.id}, entry id: #{entry.id} success"
        {:skipping} ->
          Logger.info "Refresh feed id: #{feed.id}, entry id: #{entry.id} skip"
        {:error, changeset} ->
          Logger.info "Refresh feed id: #{feed.id}, entry id: #{entry.id} error: #{inspect changeset.errors}"
      end
    end)
  end

  def import_feed(feed_url) do
    case fetch(feed_url) do
      {:ok, body} ->
        {:ok, parse_feed(body)}
      {:error, reason} ->
        {:error, reason}
    end
  end

  defp parse_feed(xml_body) do
    ElixirFeedParser.parse(xml_body)
  end

  defp fetch(feed_url) do
    HTTPoison.start
    case HTTPoison.get(feed_url) do
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      {:ok, body}
    {:ok, %HTTPoison.Response{status_code: 404}} ->
      {:error, :not_found}
    {:error, %HTTPoison.Error{reason: reason}} ->
      IO.inspect reason
      {:error, reason}
    end
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

  # generate unique guid since in RSS/Atom entries the guid ist not always unique
  defp generate_guid(feed_url, entry_guid, entry_published, entry_title) do
    unique_id_str = "#{feed_url}#{entry_guid}#{entry_published}#{entry_title}"
    :crypto.hash(:sha256, unique_id_str) |> Base.encode16
  end

end
