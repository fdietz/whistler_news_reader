defmodule WhistlerNewsReader.Api.SubscriptionController do
  use WhistlerNewsReader.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Subscription

  def create(conn, %{"feed_id" => feed_id}) do
    changeset = Subscription.changeset(%Subscription{}, %{feed_id: feed_id, user_id: current_user(conn).id})
    case Repo.insert(changeset) do
      {:ok, subscription} ->
        conn
        |> put_status(:created)
        |> render(WhistlerNewsReader.Api.SubscriptionView, "show.json", subscription: subscription)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
