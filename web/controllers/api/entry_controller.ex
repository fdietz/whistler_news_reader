defmodule WhistlerNewsReader.Api.EntryController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Fetcher

  # TODO
  def index(conn, %{"feed_id" => "today", "last_published" => last_published, "limit" => limit} = _params) do
    entries = Entry |> Entry.for_feeds(subscribed_feed_ids(conn)) |> Entry.for_today |> Entry.sorted |> Entry.load_more(last_published, limit) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  # TODO
  def index(conn, %{"feed_id" => "all", "last_published" => last_published, "limit" => limit} = _params) do
    entries = Entry |> Entry.for_feeds(subscribed_feed_ids(conn)) |> Entry.sorted |> Entry.load_more(last_published, limit) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  # TODO
  def index(conn, %{"feed_id" => feed_id, "last_published" => last_published, "limit" => limit} = _params) do
    entries = Entry |> Entry.for_feeds(subscribed_feed_ids(conn)) |> Entry.for_feed(feed_id) |> Entry.sorted |> Entry.load_more(last_published, limit) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  # TODO
  def index(conn, %{"feed_id" => "today"} = _params) do
    entries = Entry |> Entry.for_feeds(subscribed_feed_ids(conn)) |> Entry.for_today |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => "all"} = _params) do
    entries = Entry |> Entry.for_feeds(subscribed_feed_ids(conn)) |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => feed_id} = _params) do
    entries = Entry |> Entry.for_feeds(subscribed_feed_ids(conn)) |> Entry.for_feed(feed_id) |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  # TODO
  def refresh(conn, %{"feed_id" => "all"} = _params) do
    Fetcher.refresh_all
    conn |> send_resp(204, "")
  end

  # TODO
  def refresh(conn, %{"feed_id" => "today"} = _params) do
    Fetcher.refresh_all
    conn |> send_resp(204, "")
  end

  # TODO
  def refresh(conn, %{"feed_id" => feed_id} = _params) do
    feed = Repo.get!(Feed, feed_id)
    Fetcher.refresh(feed)
    conn |> send_resp(204, "")
  end

  # TODO
  def refresh(conn, %{} = _params) do
    Fetcher.refresh_all
    conn |> send_resp(204, "")
  end

  defp subscribed_feed_ids(conn) do
    Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.all |> Enum.map(fn(feed) -> feed.id end)
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
