defmodule WhistlerNewsReader.Api.EntryView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{entries: entries}) do
    %{entries: render_many(entries, WhistlerNewsReader.Api.EntryView, "entry.json")}
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
      feed: %{
        title: entry.feed.title
      }
    }
  end
end
