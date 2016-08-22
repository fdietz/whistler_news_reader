defmodule WhistlerNewsReader.EntryParser do
  @moduledoc """
  Parser for feed entry as returned by elixir-feed-parser hex package.

  Generates unique id for all feed entry.
  """

  def parse(feed, parsed_entry) do
    published    = parse_published(feed, parsed_entry)
    guid         = generate_guid(feed, parsed_entry)

    %{
      feed_id: feed.id,
      guid: guid,
      title: parsed_entry[:title],
      author: parsed_entry[:author],
      url: parsed_entry[:url],
      summary: String.slice(parse_summary(feed, parsed_entry), 0..255),
      content: sanitize_html(parsed_entry[:content] || parsed_entry[:description]),
      published: published
    }
  end

  defp convert_to_ecto_date_time(nil), do: nil
  defp convert_to_ecto_date_time(date_time) do
    %Ecto.DateTime{
      year: date_time.year, month: date_time.month, day: date_time.day,
      hour: date_time.hour, min: date_time.min, sec: date_time.sec, usec: date_time.usec
    }
  end

  defp parse_summary(_feed, parsed_entry) do
    html_to_text(parsed_entry[:summary] || parsed_entry[:content] || parsed_entry[:description])
  end

  defp parse_published(_feed, parsed_entry) do
    parsed_entry[:updated] |> convert_to_ecto_date_time
  end

  # generate unique guid since in RSS/Atom entries the guid is not always unique
  defp generate_guid(feed, parsed_entry) do
    published = parse_published(feed, parsed_entry)
    generate_guid(feed.feed_url, parsed_entry[:id], published, parsed_entry[:title])
  end
  defp generate_guid(feed_url, entry_guid, entry_published, entry_title) do
    unique_id_str = "#{feed_url}#{entry_guid}#{entry_published}#{entry_title}"
    hash = :crypto.hash(:sha256, unique_id_str)
    hash |> Base.encode16
  end

  defp sanitize_html(html) do
    html |> without_script_tags |> HtmlSanitizeEx.basic_html
  end

  defp html_to_text(nil), do: nil
  defp html_to_text(html) do
    html |> without_script_tags |> Floki.text(deep: true, js: false)
  end

  def without_script_tags(nil), do: ""
  def without_script_tags(html) do
    regexp = ~r/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i
    String.replace(html, regexp, "")
  end

end
