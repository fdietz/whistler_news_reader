defmodule WhistlerNewsReader.Api.FeedView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{feeds: feeds}) do
    %{feeds: render_many(feeds, WhistlerNewsReader.Api.FeedView, "feed.json")}
  end

  def render("show.json", %{feed: feed}) do
    %{feed: render_one(feed, WhistlerNewsReader.Api.FeedView, "feed.json")}
  end

  def render("feed.json", %{feed: feed}) do
    %{
      id: feed.id,
      title: feed.title,
      feed_url: feed.feed_url,
      site_url: feed.site_url,
      last_refreshed_at: feed.last_refreshed_at
     }
  end

end
