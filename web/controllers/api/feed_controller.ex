defmodule WhistlerNewsReader.Api.FeedController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.FeedImporter

  def index(conn, %{} = _params) do
    feeds = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.all
    IO.inspect feeds
    render(conn, "index.json", feeds: feeds)
  end

  def create(conn, %{"feed_url" => feed_url} = _params) do
    case FeedImporter.import_feed(current_user(conn), feed_url) do
      {:ok, feed} ->
        conn
        |> put_status(:created)
        |> render("feed.json", feed: feed)
      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> render(WhistlerNewsReader.Api.ErrorView, "not_found.json")
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    feed = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.get!(id)

    Repo.delete!(List.first(feed.subscriptions))

    conn
    |> put_status(204)
    |> render("feed.json", feed: feed)
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
