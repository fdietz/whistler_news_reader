defmodule WhistlerNewsReader.Api.FeedController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Fetcher

  def index(conn, %{} = _params) do
    feeds = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.all
    render(conn, "index.json", feeds: feeds)
  end

  def create(conn, %{"feed_url" => feed_url} = _params) do
    case Fetcher.import_feed(feed_url) do
      {:ok, feed_attrs} ->
        try do
          case store_feed_and_user_subscription(conn, feed_attrs, feed_url) do
            {:ok, feed} ->
              conn
              |> put_status(:created)
              |> render("feed.json", feed: feed)
          end
        rescue
          e in Ecto.InvalidChangesetError ->
            conn
            |> put_status(:unprocessable_entity)
            |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: e.changeset)
        end

      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> render(WhistlerNewsReader.Api.ErrorView, "not_found.json")
    end
  end

  defp store_feed_and_user_subscription(conn, feed_attrs, feed_url) do
    Repo.transaction(fn ->
      changeset = %Feed{} |> Feed.changeset(%{
        title: feed_attrs.title,
        feed_url: feed_url,
        site_url: feed_attrs.url
      })
      feed = Repo.insert!(changeset)
      Repo.insert!(Ecto.build_assoc(
        feed,
        :subscriptions,
        user_id: current_user(conn).id
      ))
      feed
    end)
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
