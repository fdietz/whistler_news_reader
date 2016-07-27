defmodule WhistlerNewsReader.Api.ImportController do
  use WhistlerNewsReader.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  plug :scrub_params, "file" when action in [:create]

  alias WhistlerNewsReader.OpmlImport

  require Logger

  def create(conn, %{"file" => %Plug.Upload{filename: _filename, path: path}} = _params) do
    case OpmlImport.import(current_user(conn), File.read!(path)) do
      :ok ->
        conn
        |> send_resp(204, "")
      error ->
        Logger.error "ImportController - error #{inspect(error)}"
        conn
        |> send_resp(422, inspect(error))
    end
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
