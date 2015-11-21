defmodule WhistlerNewsReader.FeedChannel do
  use WhistlerNewsReader.Web, :channel

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Fetcher

  def join("feeds:all", _params, socket) do
    feeds = Feed |> Repo.all
    {:ok, %{feeds: feeds}, socket }
  end

  def handle_in("feeds:create", %{"feed_url" => feed_url} = _params, socket) do
    {:ok, feed} = Fetcher.import_feed(feed_url)
    {:reply, {:ok, %{feed: feed} }, socket}
  end
end
