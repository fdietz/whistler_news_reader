defmodule WhistlerNewsReader.Api.FeedController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.UnreadEntry
  alias WhistlerNewsReader.FeedImporter
  alias WhistlerNewsReader.FeedRefresher
  alias WhistlerNewsReader.StoreEntryHelper

  plug :scrub_params, "feed" when action in [:create]

  def index(conn, %{} = _params) do
    feeds = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.all
    unread_entries_count = UnreadEntry |> UnreadEntry.count_for_feeds(Enum.map(feeds, fn(f) -> f.id end)) |> Repo.all
    render(conn, "index.json", feeds: feeds, unread_entries_count: unread_entries_count)
  end

  def create(conn, %{"feed" => feed_attributes} = _params) do
    case FeedImporter.import_feed(current_user(conn), feed_attributes) do
      {:ok, feed} ->
        feed = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.get!(feed.id)
        FeedRefresher.refresh(feed)
        unread_entries_count = UnreadEntry |> UnreadEntry.count_for_feeds([feed.id]) |> Repo.all
        conn
        |> put_status(:created)
        |> put_resp_header("location", feed_path(conn, :show, feed))
        |> render("show.json", feed: feed, unread_entries_count: unread_entries_count)
      {:error, :not_found} ->
        conn
        |> send_resp(404, "")
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "feed" => feed_params} = _params) do
    feed = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.get!(id)
    case feed
         |> Feed.changeset(feed_params)
         |> Repo.update do
      {:ok, _feed} ->
        conn
        |> send_resp(204, "")
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    feed = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.get!(id)
    unread_entries_count = UnreadEntry |> UnreadEntry.count_for_feeds([feed.id]) |> Repo.all
    conn
    |> render("show.json", feed: feed, unread_entries_count: unread_entries_count)
  end

  def delete(conn, %{"id" => id}) do
    feed = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.get!(id)
    Repo.delete!(List.first(feed.subscriptions))

    conn
    |> send_resp(204, "")
  end

  def update_category(conn, %{"id" => id, "category_id" => category_id}) do
    feed = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.get!(id)
    StoreEntryHelper.update_feed_category!(feed, category_id)
    conn |> send_resp(204, "")
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
