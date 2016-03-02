defmodule WhistlerNewsReader.StoreEntryHelper do

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.ReadEntry
  alias WhistlerNewsReader.UnreadEntry
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Repo

  def store_entry(feed, entry) do
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

    case insert_or_skip(result) do
      {:ok, entry} ->
        mark_as_unread_entry(entry)
        {:ok, entry}
      {:skipping} ->
        {:skipping}
    end
  end

  # wrap in transaction
  def mark_as_read(user, entry) do
    unread_entries = UnreadEntry
                     |> UnreadEntry.for_feed(entry.feed_id)
                     |> UnreadEntry.for_user(user.id)
                     |> UnreadEntry.for_entry(entry.id)
                     |> Repo.all
    Enum.each(unread_entries, fn(entry) ->
      Repo.delete!(entry)
    end)

    %ReadEntry{}
    |> ReadEntry.changeset(%{entry_id: entry.id, feed_id: entry.feed_id, user_id: user.id})
    |> Repo.insert!
  end

  defp mark_as_unread_entry(entry) do
    subscription = Subscription
                   |> Subscription.for_feed(entry.feed_id)
                   |> Repo.all
    Enum.each(subscription, fn(s) ->
      %UnreadEntry{}
      |> UnreadEntry.changeset(%{entry_id: entry.id, feed_id: entry.feed_id, user_id: s.user_id})
      |> Repo.insert!
    end)
  end

  # TODO: refactor to sql insert and ignore instead
  # returns {:ok, entry} on success
  defp insert_or_skip(result) do
    case Entry |> Entry.for_guid(result[:guid]) |> Repo.all do
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
