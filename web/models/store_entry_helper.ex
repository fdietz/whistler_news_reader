defmodule WhistlerNewsReader.StoreEntryHelper do

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.MarkAsReadHelper

  def store_entry(feed, parsed_entry) do
    entry_attrs = normalized_entry_attrs(feed, parsed_entry)
    case insert_or_skip(entry_attrs) do
      {:ok, :skipping} ->
        {:ok, :skipping}
      {:ok, entry} ->
        MarkAsReadHelper.mark_as_unread_entry(entry)
        {:ok, entry}
      error ->
        error
    end
  end

  def normalized_entry_attrs(feed, parsed_entry) do
    published    = parse_published(feed, parsed_entry)
    guid         = generate_guid(feed, parsed_entry)
    text_content = parse_text_content(feed, parsed_entry)

    %{
      feed_id: feed.id,
      guid: guid,
      title: parsed_entry[:title],
      author: parsed_entry[:author],
      url: parsed_entry[:url],
      summary: parsed_entry[:summary] || String.slice(text_content, 0..255),
      content: parsed_entry[:content] || parsed_entry[:description],
      published: published
    }
  end

  defp insert_or_skip(entry_attrs) do
    if Repo.get_by(Entry, guid: entry_attrs[:guid]) do
      {:ok, :skipping}
    else
      entry = %Entry{} |> Entry.changeset(entry_attrs) |> Repo.insert
      case entry do
        {:ok, entry} ->
          {:ok, entry}
        error ->
          error
      end
    end
  end

  defp convert_to_ecto_date_time(nil), do: nil
  defp convert_to_ecto_date_time(date_time) do
    %Ecto.DateTime{
      year: date_time.year, month: date_time.month, day: date_time.day,
      hour: date_time.hour, min: date_time.min, sec: date_time.sec, usec: date_time.usec
    }
  end

  defp parse_text_content(feed, parsed_entry) do
    Floki.text(parsed_entry[:content] || parsed_entry[:description] || "")
  end

  defp parse_published(feed, parsed_entry) do
    parsed_entry[:updated] |> convert_to_ecto_date_time
  end

  # generate unique guid since in RSS/Atom entries the guid is not always unique
  defp generate_guid(feed, parsed_entry) do
    published = parse_published(feed, parsed_entry)
    generate_guid(feed.feed_url, parsed_entry[:id], published, parsed_entry[:title])
  end
  defp generate_guid(feed_url, entry_guid, entry_published, entry_title) do
    unique_id_str = "#{feed_url}#{entry_guid}#{entry_published}#{entry_title}"
    :crypto.hash(:sha256, unique_id_str) |> Base.encode16
  end
end
