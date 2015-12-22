defmodule WhistlerNewsReader.Api.FeedController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Fetcher

  def index(conn, %{} = _params) do
    feeds = Feed |> Repo.all
    render(conn, "index.json", feeds: feeds)
  end

  def create(conn, %{"feed_url" => feed_url} = _params) do
    case Fetcher.import_feed(feed_url) do
      {:ok, feed}      -> render(conn, "show.json", feed: feed)
      {:error, error } -> send_resp(conn, 400, "")
    end
  end
end
