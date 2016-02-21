defmodule WhistlerNewsReader.Api.SessionController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User

  plug :scrub_params, "session" when action in [:create]

  def create(conn, %{"session" => session_params}) do

    case WhistlerNewsReader.Session.authenticate(session_params) do
      {:ok, user} ->
        {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

        conn
        |> put_status(:created)
        |> render("show.json", jwt: jwt, user: user)

      {:error} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end
end
