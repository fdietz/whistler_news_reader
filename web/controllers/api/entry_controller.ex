defmodule WhistlerNewsReader.Api.EntryController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.FeedRefresher

  # TODO: add unit test
  def index(conn, %{"feed_id" => "today", "last_published" => last_published, "limit" => limit} = _params) do
    entries = subscribed_feed_entries(conn) |> Entry.for_today |> load_more(last_published, limit)
    render(conn, "index.json", entries: entries)
  end

  # TODO: add unit test
  def index(conn, %{"feed_id" => "all", "last_published" => last_published, "limit" => limit} = _params) do
    entries = subscribed_feed_entries(conn) |> load_more(last_published, limit)
    render(conn, "index.json", entries: entries)
  end

  # TODO: add unit test
  def index(conn, %{"feed_id" => feed_id, "last_published" => last_published, "limit" => limit} = _params) do
    entries = subscribed_feed_entries(conn) |> Entry.for_feed(feed_id) |> load_more(last_published, limit)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => "today"} = _params) do
    entries = subscribed_feed_entries(conn) |> Entry.for_today |> sort_limit_and_preload
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => "all"} = _params) do
    entries = subscribed_feed_entries(conn) |> sort_limit_and_preload
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => feed_id} = _params) do
    entries = subscribed_feed_entries(conn) |> Entry.for_feed(feed_id) |> sort_limit_and_preload
    render(conn, "index.json", entries: entries)
  end

  # TODO: add unit test
  def refresh(conn, %{"feed_id" => "all"} = _params) do
    FeedRefresher.refresh_all(subscribed_feeds(conn))
    conn |> send_resp(204, "")
  end

  # TODO: add unit test
  def refresh(conn, %{"feed_id" => "today"} = _params) do
    FeedRefresher.refresh_all(subscribed_feeds(conn))
    conn |> send_resp(204, "")
  end

  # TODO: add unit test
  def refresh(conn, %{"feed_id" => feed_id} = _params) do
    feed = Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.get!(String.to_integer(feed_id))
    FeedRefresher.refresh(feed)
    conn |> send_resp(204, "")
  end

  defp load_more(query, last_published, limit) do
    query |> Entry.gt_last_published(last_published) |> sort_limit_and_preload(limit)
  end

  defp sort_limit_and_preload(query, limit \\20) do
    query |> Entry.sorted |> Entry.limit(limit) |> Repo.all |> Repo.preload(:feed)
  end

  defp subscribed_feed_entries(conn) do
    Entry |> Entry.for_feeds(subscribed_feed_ids(conn))
  end

  defp subscribed_feed_ids(conn) do
    subscribed_feeds(conn) |> Enum.map(fn(feed) -> feed.id end)
  end

  defp subscribed_feeds(conn) do
    Feed |> Feed.subscribed_by_user(current_user(conn).id) |> Repo.all
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
