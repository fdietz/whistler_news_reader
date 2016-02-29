defmodule WhistlerNewsReader.Api.FeedController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Fetcher

  def index(conn, %{} = _params) do
    feeds = Feed |> Feed.for_user(current_user(conn).id) |> Repo.all
    render(conn, "index.json", feeds: feeds)
  end

  def create(conn, %{"feed_url" => feed_url} = _params) do
    case Fetcher.import_feed(feed_url) do
      {:ok, feed_attrs} ->
        changeset = Feed.changeset(%Feed{}, %{
          title: feed_attrs.title,
          feed_url: feed_url,
          site_url: feed_attrs.url
        })
        case Repo.insert(changeset) do
          {:ok, feed} ->
            subscription = Ecto.build_assoc(
              feed,
              :subscriptions,
              user_id: current_user(conn).id
            )
            Repo.insert!(subscription)
            
            conn
            |> put_status(:created)
            |> render("feed.json", feed: feed)

          {:error, changeset} ->
            conn
            |> put_status(:unprocessable_entity)
            |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: changeset)
        end

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> render(WhistlerNewsReader.Api.ErrorView, "not_found.json")
    end
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
