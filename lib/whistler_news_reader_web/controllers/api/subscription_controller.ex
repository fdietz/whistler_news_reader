defmodule WhistlerNewsReaderWeb.Api.SubscriptionController do
  use WhistlerNewsReaderWeb, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReaderWeb.Api.SessionController

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.SubscribedEntry

  plug :scrub_params, "subscription" when action in [:create, :update]

  def index(conn, %{} = _params) do
    subscriptions = Subscription |> Subscription.for_user_id(current_user(conn).id) |> Repo.all |> Repo.preload(:feed)
    unread_entries_count = SubscribedEntry |> SubscribedEntry.count_for_subscription_ids(Enum.map(subscriptions, fn(s) -> s.id end)) |> Repo.all
    render(conn, "index.json", subscriptions: subscriptions, unread_entries_count: unread_entries_count)
  end

  def create(conn, %{"subscription" => subscription_params}) do
    changeset = Subscription.changeset(%Subscription{}, Map.put(subscription_params, "user_id", current_user(conn).id))
    case Repo.insert(changeset) do
      {:ok, subscription} ->
        subscription = Repo.get!(Subscription, subscription.id) |> Repo.preload(:feed)
        unread_entries_count = SubscribedEntry |> SubscribedEntry.count_for_subscription_ids([subscription.id]) |> Repo.all
        conn
        |> put_status(:created)
        |> put_resp_header("location", subscription_path(conn, :show, subscription))
        |> render(WhistlerNewsReaderWeb.Api.SubscriptionView, "show.json", subscription: subscription, unread_entries_count: unread_entries_count)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReaderWeb.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "subscription" => subscription_params} = _params) do
    subscription = Subscription |> Repo.get!(id)
    changeset = subscription |> Subscription.changeset(subscription_params)
    case Repo.update(changeset) do
      {:ok, _subscription} ->
        conn
        |> send_resp(204, "")
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReaderWeb.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    subscription = Repo.get!(Subscription, id)
    Repo.delete!(subscription)

    conn
    |> send_resp(204, "")
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
