defmodule WhistlerNewsReader.Api.EntryView do
  use WhistlerNewsReader.Web, :view
  alias WhistlerNewsReader.UnreadEntry
  alias WhistlerNewsReader.Repo

  # TODO: refactor current_user handling
  def render("index.json", %{entries: entries, current_user: current_user}) do
    %{
      entries: Enum.map(entries, fn(entry) ->
        %{
          id: entry.id,
          title: entry.title,
          published: entry.published,
          author: entry.author,
          summary: entry.summary,
          content: entry.content,
          url: entry.url,
          unread: false,
          feed: %{
            id: entry.feed.id,
            title: entry.feed.title
          }
        }
      end)
    }
  end

  def render("entry.json", %{entry: entry, current_user: current_user}) do
    %{
      id: entry.id,
      title: entry.title,
      published: entry.published,
      author: entry.author,
      summary: entry.summary,
      content: entry.content,
      url: entry.url,
      unread: false,
      feed: %{
        id: entry.feed.id,
        title: entry.feed.title
      }
    }
  end

end
