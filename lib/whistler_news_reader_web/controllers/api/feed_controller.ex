defmodule WhistlerNewsReaderWeb.Api.FeedController do
  use WhistlerNewsReaderWeb, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReaderWeb.Api.SessionController

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.FeedServer

  plug :scrub_params, "feed" when action in [:create, :update]

  def index(conn, %{"q" => query_string} = _params) do
    feeds = Feed |> Feed.search_by(query_string) |> Repo.all
    render(conn, "index.json", feeds: feeds)
  end

  def index(conn, %{} = _params) do
    feeds = Feed |> Repo.all
    render(conn, "index.json", feeds: feeds)
  end

  def create(conn, %{"feed" => feed_attributes} = _params) do
    case FeedServer.import(current_user(conn), feed_attributes) do
      {:ok, feed} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", feed_path(conn, :show, feed))
        |> render("show.json", feed: feed)
      {:error, :feed_url_not_found} ->
        conn |> send_resp(404, "Feed not found")
      {:error, :feed_format_unknown} ->
        conn |> send_resp(422, "Feed format unknown")
      {:error, %Ecto.Changeset{} = changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReaderWeb.Api.ErrorView, "error.json", changeset: changeset)
      {:error, reason} ->
        Logger.error(inspect(reason))
        conn |> send_resp(500, "Internal Server Error")
    end
  end

  def update(conn, %{"id" => id, "feed" => feed_params} = _params) do
    feed = Repo.get!(Feed, id)
    changeset = Feed.changeset(feed, feed_params)
    case Repo.update(changeset) do
      {:ok, _feed} ->
        conn |> send_resp(204, "")
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReaderWeb.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    feed = Repo.get!(Feed, id)
    conn |> render("show.json", feed: feed)
  end

  def delete(conn, %{"id" => id}) do
    feed = Repo.get!(Feed, id)
    Repo.delete!(feed)
    conn |> send_resp(204, "")
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
