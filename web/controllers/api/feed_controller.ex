defmodule WhistlerNewsReader.Api.FeedController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Fetcher

  def index(conn, %{} = _params) do
    feeds = Feed |> Repo.all
    # feeds = Feed |> Feed.for_user(current_user(conn).id) |> Repo.all
    render(conn, "index.json", feeds: feeds)
  end

  def create(conn, %{"feed_url" => feed_url} = _params) do
    case Fetcher.import_feed(feed_url) do
      {:ok, feed}     ->
        subscription = Ecto.build_assoc(feed, :subscriptions, user_id: current_user(conn).id)
        Repo.insert!(subscription)
        render(conn, "feed.json", feed: feed)
      {:error, error} ->
        Logger.error(error)
        send_resp(conn, 400, "")
    end
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
