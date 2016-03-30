defmodule WhistlerNewsReader.Api.CategoryController do
  use WhistlerNewsReader.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Category

  def index(conn, %{} = _params) do
    categories = Category |> Category.for_user_id(current_user(conn).id) |> Repo.all
    render(conn, "index.json", categories: categories)
  end

  def create(conn, %{} = params) do
    case %Category{} |> Category.changeset(params) |> Repo.insert do
      {:ok, category} ->
        conn
        |> render(conn, "show.json", category: category)
      {:error, changeset} ->
        conn
        |> render(conn, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    category = Category |> Category.for_user_id(current_user(conn).id) |> Repo.get!(id)
    Repo.delete!(category)

    conn
    |> send_resp(204, "")
  end
  
  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
