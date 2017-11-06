defmodule WhistlerNewsReaderWeb.Api.CurrentUserController do
  use WhistlerNewsReaderWeb, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReaderWeb.Api.SessionController

  def show(conn, _) do
    case decode_and_verify_token(conn) do
      {:ok, _claims} ->
        user = Guardian.Plug.current_resource(conn)

        conn
        |> put_status(:ok)
        |> render("show.json", user: user)
      {:error, _reason} ->
        conn
        |> put_status(:not_found)
        |> render(WhistlerNewsReaderWeb.Api.SessionView, "error.json", error: "Not found")
    end
  end

  defp decode_and_verify_token(conn) do
    conn
    |> Guardian.Plug.current_token
    |> Guardian.decode_and_verify
  end
end
