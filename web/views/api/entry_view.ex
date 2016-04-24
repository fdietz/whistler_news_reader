defmodule WhistlerNewsReader.Api.EntryView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{entries: entries}) do
    %{entries: render_many(entries, WhistlerNewsReader.Api.EntryView, "entry.json")}
  end

  def render("show.json", %{entry: entry}) do
    %{entry: render_one(entry, WhistlerNewsReader.Api.EntryView, "entry.json")}
  end

  def render("entry.json", %{entry: entry}) do
    %{
      id: entry.id,
      title: entry.title,
      published: entry.published,
      author: entry.author,
      summary: entry.summary,
      content: entry.content,
      url: entry.url,
      unread: true,
      subscription_id: unread_entry(entry).subscription_id
    }
  end

  defp unread_entry(entry) do
    Enum.at(entry.unread_entries, 0)
  end
end
