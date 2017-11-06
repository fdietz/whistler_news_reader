defmodule WhistlerNewsReaderWeb.Api.SessionController do
  use WhistlerNewsReaderWeb, :controller
  require Logger

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User

  plug :scrub_params, "session" when action in [:create]

  def create(conn, %{"session" => session_params}) do
    case authenticate(session_params) do
      {:ok, user} ->
        {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

        conn
        |> put_status(:created)
        |> render("show.json", jwt: jwt, user: user)

      :error ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json")
    end
  end

  def delete(conn, _) do
    {:ok, claims} = Guardian.Plug.claims(conn)

    conn
    |> Guardian.Plug.current_token
    |> Guardian.revoke!(claims)

    conn
    |> render("delete.json")
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:forbidden)
    |> render(WhistlerNewsReaderWeb.Api.SessionView, "forbidden.json", error: "Not Authenticated")
  end

  defp authenticate(%{"email" => email, "password" => password}) do
    user = Repo.get_by(User, email: String.downcase(email || ""))

    case check_password(user, password) do
      true -> {:ok, user}
      _    -> :error
    end
  end

  defp check_password(user, password) do
    case user do
      nil -> false
      _   -> Comeonin.Bcrypt.checkpw(password, user.encrypted_password)
    end
  end
end
