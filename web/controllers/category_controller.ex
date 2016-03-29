defmodule WhistlerNewsReader.Api.CategoryController do
  use WhistlerNewsReader.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Category

  def index(conn, %{} = _params) do
    categories = Category |> Category.for_user_id(current_user(conn).id) |> Repo.all
    render(conn, "index.json", categories: categories)
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
