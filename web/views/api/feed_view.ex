defmodule WhistlerNewsReader.Api.FeedView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{feeds: feeds}) do
    %{feeds: render_many(feeds, WhistlerNewsReader.Api.FeedView, "feed.json")}
  end

  def render("feed.json", %{feed: feed}) do
    %{
      id: feed.id,
      title: feed.title,
      feed_url: feed.feed_url,
      site_url: feed.site_url,
      last_updated: feed.last_updated,
      subscription_id: List.first(feed.subscriptions).id
     }
  end

  def render("created_feed.json", %{feed: feed}) do
    %{
      id: feed.id,
      title: feed.title,
      feed_url: feed.feed_url,
      site_url: feed.site_url,
      last_updated: feed.last_updated
     }
  end
end
