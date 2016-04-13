defmodule WhistlerNewsReader.Api.FeedView do
  use WhistlerNewsReader.Web, :view

  # TODO: is there a more elegant way to do this using render_many?
  def render("index.json", %{feeds: feeds, unread_entries_count: unread_entries_count}) do
    %{
      feeds: Enum.map(feeds, fn(feed) ->
        result = render("feed.json", feed: feed)
        Map.put(result, :unread_count, unread_entries_count_for(feed, unread_entries_count))
      end)
    }
  end

  # TODO: is there a more elegant way to do this using render_one?
  def render("show.json", %{feed: feed, unread_entries_count: unread_entries_count}) do
    # result = %{feed: render_one(feed, WhistlerNewsReader.Api.FeedView, "feed.json")}
    result = render("feed.json", feed: feed)
    result = Map.put(result, :unread_count, unread_entries_count_for(feed, unread_entries_count))
    %{
      feed:  result
    }
  end

  def render("feed.json", %{feed: feed}) do
    %{
      id: feed.id,
      title: feed.title,
      feed_url: feed.feed_url,
      site_url: feed.site_url,
      last_refreshed_at: feed.last_refreshed_at,
      category_id: category_id(feed)
     }
  end

  defp category_id(feed) do
    subscription = List.first(feed.subscriptions)
    subscription.category_id
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
