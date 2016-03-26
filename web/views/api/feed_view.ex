defmodule WhistlerNewsReader.Api.FeedView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{feeds: feeds, unread_entries_count: unread_entries_count}) do
    %{
      feeds: Enum.map(feeds, fn(feed) ->
        %{
          id: feed.id,
          title: feed.title,
          feed_url: feed.feed_url,
          site_url: feed.site_url,
          last_updated: feed.last_updated,
          unread_count: unread_entries_count_for(feed, unread_entries_count)
         }
      end)
    }
    # %{feeds: render_many(feeds, WhistlerNewsReader.Api.FeedView, "feed.json")}
  end

  def render("feed.json", %{feed: feed}) do
    %{
      id: feed.id,
      title: feed.title,
      feed_url: feed.feed_url,
      site_url: feed.site_url,
      last_updated: feed.last_updated
     }
  end

  defp unread_entries_count_for(feed, unread_entries_count) do
    arr = Enum.find(unread_entries_count, fn(arr) -> feed.id == List.first(arr) end)

    case arr do
      [_feed_id, count] ->
        count
      nil -> 0
    end
  end

end
