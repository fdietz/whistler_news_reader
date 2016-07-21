defmodule WhistlerNewsReader.Api.SubscribedEntryController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.SubscribedEntry
  alias WhistlerNewsReader.MarkAsReadHelper
  alias WhistlerNewsReader.FeedServer

  def index(conn, %{"subscription_id" => "today", "last_published" => last_published, "limit" => limit} = _params) do
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_user_id(current_user(conn).id) |> SubscribedEntry.for_unread |> SubscribedEntry.for_today |> load_more(last_published, limit)
    render(conn, "index.json", subscribed_entries: subscribed_entries, current_user: current_user(conn))
  end

  def index(conn, %{"subscription_id" => "all", "last_published" => last_published, "limit" => limit} = _params) do
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_user_id(current_user(conn).id) |> SubscribedEntry.for_unread |> load_more(last_published, limit)
    render(conn, "index.json", subscribed_entries: subscribed_entries, current_user: current_user(conn))
  end

  def index(conn, %{"subscription_id" => subscription_id, "last_published" => last_published, "limit" => limit} = _params) do
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_subscription_id(subscription_id) |> SubscribedEntry.for_unread |> load_more(last_published, limit)
    render(conn, "index.json", subscribed_entries: subscribed_entries, current_user: current_user(conn))
  end

  def index(conn, %{"category_id" => category_id, "last_published" => last_published, "limit" => limit} = _params) do
    subscriptions = Subscription |> Subscription.for_category_id(category_id) |> Repo.all
    subscription_ids = Enum.map(subscriptions, fn(subscription) -> subscription.id end)
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_subscription_ids(subscription_ids) |> SubscribedEntry.for_unread |> load_more(last_published, limit)
    render(conn, "index.json", subscribed_entries: subscribed_entries, current_user: current_user(conn))
  end

  def index(conn, %{"subscription_id" => "today"} = _params) do
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_user_id(current_user(conn).id) |> SubscribedEntry.for_today |> SubscribedEntry.for_unread |> sort_limit_and_preload
    render(conn, "index.json", subscribed_entries: subscribed_entries, current_user: current_user(conn))
  end

  def index(conn, %{"subscription_id" => "all"} = _params) do
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_user_id(current_user(conn).id) |> SubscribedEntry.for_unread |> sort_limit_and_preload
    render(conn, "index.json", subscribed_entries: subscribed_entries, current_user: current_user(conn))
  end

  def index(conn, %{"subscription_id" => subscription_id} = _params) do
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_subscription_id(subscription_id) |> SubscribedEntry.for_unread |> sort_limit_and_preload
    render(conn, "index.json", subscribed_entries: subscribed_entries)
  end

  def index(conn, %{"category_id" => category_id} = _params) do
    subscriptions = Subscription |> Subscription.for_category_id(category_id) |> Repo.all
    subscription_ids = Enum.map(subscriptions, fn(subscription) -> subscription.id end)
    subscribed_entries = SubscribedEntry |> SubscribedEntry.for_subscription_ids(subscription_ids) |> SubscribedEntry.for_unread |> sort_limit_and_preload
    render(conn, "index.json", subscribed_entries: subscribed_entries, current_user: current_user(conn))
  end

  def refresh(conn, %{"subscription_id" => "all"} = _params) do
    subscriptions = Subscription |> Subscription.for_user_id(current_user(conn).id) |> Repo.all |> Repo.preload(:feed)
    feeds = Enum.map(subscriptions, fn(subscription) -> subscription.feed end)
    FeedServer.refresh_all(feeds)
    conn |> send_resp(204, "")
  end

  def refresh(conn, %{"subscription_id" => "today"} = _params) do
    subscriptions = Subscription |> Subscription.for_user_id(current_user(conn).id) |> Repo.all |> Repo.preload(:feed)
    feeds = Enum.map(subscriptions, fn(subscription) -> subscription.feed end)
    FeedServer.refresh_all(feeds)
    conn |> send_resp(204, "")
  end

  def refresh(conn, %{"subscription_id" => subscription_id} = _params) do
    subscription = Repo.get!(Subscription, subscription_id) |> Repo.preload(:feed)
    FeedServer.refresh(subscription.feed)
    conn |> send_resp(204, "")
  end

  def refresh(conn, %{"category_id" => category_id} = _params) do
    subscriptions = Subscription |> Subscription.for_category_id(category_id) |> Repo.all |> Repo.preload(:feed)
    feeds = Enum.map(subscriptions, fn(subscription) -> subscription.feed end)
    FeedServer.refresh_all(feeds)
    conn |> send_resp(204, "")
  end

  def mark_as_read(conn, %{"id" => id}) do
    subscribed_entry = Repo.get!(SubscribedEntry, id)
    MarkAsReadHelper.mark_entry_as_read(current_user(conn), subscribed_entry)
    conn |> send_resp(204, "")
  end

  def mark_all_as_read(conn, %{"subscription_id" => "all"}) do
    SubscribedEntry |> SubscribedEntry.for_unread |> Repo.update_all(set: [read: true])
    conn |> send_resp(204, "")
  end

  def mark_all_as_read(conn, %{"subscription_id" => "today"}) do
    SubscribedEntry |> SubscribedEntry.for_today |> SubscribedEntry.for_unread |> Repo.update_all(set: [read: true])
    conn |> send_resp(204, "")
  end

  def mark_all_as_read(conn, %{"subscription_id" => subscription_id}) do
    subscription = Repo.get!(Subscription, subscription_id)
    MarkAsReadHelper.mark_all_subscriptions_as_read(current_user(conn), [subscription])
    conn |> send_resp(204, "")
  end

  def mark_all_as_read(conn, %{"category_id" => category_id}) do
    subscriptions = Subscription |> Subscription.for_category_id(category_id) |> Repo.all
    MarkAsReadHelper.mark_all_subscriptions_as_read(current_user(conn), subscriptions)
    conn |> send_resp(204, "")
  end

  defp load_more(query, last_published, limit) do
    query |> SubscribedEntry.gt_last_published(last_published) |> sort_limit_and_preload(limit)
  end

  defp sort_limit_and_preload(query, limit \\20) do
    query |> SubscribedEntry.sorted |> SubscribedEntry.limit(limit) |> Repo.all |> Repo.preload([:entry, :subscription])
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
