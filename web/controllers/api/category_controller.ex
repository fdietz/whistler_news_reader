defmodule WhistlerNewsReader.Api.CategoryController do
  use WhistlerNewsReader.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.Category

  plug :scrub_params, "category" when action in [:create]

  def index(conn, %{} = _params) do
    categories = Category |> Category.for_user_id(current_user(conn).id) |> Repo.all
    render(conn, "index.json", categories: categories)
  end

  def create(conn, %{"category" => category_params} = _params) do
    case %Category{}
         |> Category.changeset(Map.put(category_params, "user_id", current_user(conn).id))
         |> Repo.insert do
      {:ok, category} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", category_path(conn, :show, category))
        |> render("show.json", category: category)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "category" => category_params} = _params) do
    category = Category |> Category.for_user_id(current_user(conn).id) |> Repo.get!(id)
    case category
         |> Category.changeset(category_params)
         |> Repo.update do
      {:ok, category} ->
        conn
        |> render("show.json", category: category)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(WhistlerNewsReader.Api.ErrorView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    category = Category |> Category.for_user_id(current_user(conn).id) |> Repo.get!(id)

    conn
    |> render("show.json", category: category)
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
