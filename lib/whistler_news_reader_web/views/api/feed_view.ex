defmodule WhistlerNewsReaderWeb.Api.FeedView do
  use WhistlerNewsReaderWeb, :view

  def render("index.json", %{feeds: feeds}) do
    %{feeds: render_many(feeds, WhistlerNewsReaderWeb.Api.FeedView, "feed.json")}
  end

  def render("show.json", %{feed: feed}) do
    %{feed: render_one(feed, WhistlerNewsReaderWeb.Api.FeedView, "feed.json")}
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
