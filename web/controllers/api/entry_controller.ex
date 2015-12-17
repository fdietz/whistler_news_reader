defmodule WhistlerNewsReader.Api.EntryController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Fetcher

  def index(conn, %{"feed_id" => "today", "last_published" => last_published, "limit" => limit} = _params) do
    entries = Entry |> Entry.for_today |> Entry.sorted |> Entry.load_more(last_published, limit) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => "all", "last_published" => last_published, "limit" => limit} = _params) do
    entries = Entry |> Entry.sorted |> Entry.load_more(last_published, limit) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => feed_id, "last_published" => last_published, "limit" => limit} = _params) do
    entries = Entry |> Entry.for_feed(feed_id) |> Entry.sorted |> Entry.load_more(last_published, limit) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => "today"} = _params) do
    entries = Entry |> Entry.for_today |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => "all"} = _params) do
    entries = Entry |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{"feed_id" => feed_id} = _params) do
    entries = Entry |> Entry.for_feed(feed_id) |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{} = _params) do
    entries = Entry |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def refresh(conn, %{"feed_id" => "all"} = _params) do
    Fetcher.refresh_all
    conn |> send_resp(204, "")
  end

  def refresh(conn, %{"feed_id" => "today"} = _params) do
    Fetcher.refresh_all
    conn |> send_resp(204, "")
  end

  def refresh(conn, %{"feed_id" => feed_id} = _params) do
    feed = Repo.get!(Feed, feed_id)
    Fetcher.refresh(feed)
    conn |> send_resp(204, "")
  end

  def refresh(conn, %{} = _params) do
    Fetcher.refresh_all
    conn |> send_resp(204, "")
  end
end
