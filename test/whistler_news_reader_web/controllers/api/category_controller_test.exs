defmodule WhistlerNewsReaderWeb.Api.CategoryControllerTest do
  use WhistlerNewsReaderWeb.ConnCase, async: false

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Category

  setup do
    user = insert(:user)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    category = insert(:category, user: user)

    conn = build_conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, user: user, category: category}
  end

  test "GET /api/categories succeeds", %{conn: conn, jwt: jwt, category: category} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, category_path(conn, :index)

    result = List.first(json_response(conn, 200)["categories"])
    assert result["id"] == category.id
    assert result["title"] == category.title
  end

  test "GET /api/categories fails if no token", %{conn: conn} do
    conn = get conn, category_path(conn, :index)
    assert json_response(conn, 403)["error"] == "Not Authenticated"
  end

  test "GET /api/categories/:id succeeds", %{conn: conn, jwt: jwt, category: category} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, category_path(conn, :show, category.id)

    result = json_response(conn, 200)["category"]
    assert result["id"] == category.id
    assert result["title"] == category.title
  end

  test "POST /api/categories succeeds", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, category_path(conn, :create), category: %{title: "title"}

    assert json_response(conn, 201)
    category_id = json_response(conn, 201)["category"]["id"]
    assert Repo.get!(Category, category_id)
  end

  test "POST /api/categories fails if data invalid", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, category_path(conn, :create), category: %{}

    assert json_response(conn, 422)
    assert json_response(conn, 422)["errors"]
  end

  test "PUT /api/categories succeeds", %{conn: conn, jwt: jwt, category: category} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, category_path(conn, :update, category.id), category: %{title: "new name"}

    assert conn.status == 204
    assert Repo.get!(Category, category.id).title, "new name"
  end

  test "DELETE /api/categories/:id succeeds", %{conn: conn, jwt: jwt, category: category} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = delete conn, category_path(conn, :delete, category.id)
    assert conn.status == 204
    refute Repo.get(Category, category.id)
  end

  test "DELETE /api/categories/:id fails if feed exists", %{conn: conn, jwt: jwt, user: user, category: category} do
    feed = insert(:feed)
    insert(:subscription, user: user, feed: feed, category: category)

    conn = conn |> put_req_header("authorization", jwt)
    conn = delete conn, category_path(conn, :delete, category.id)
    assert conn.status == 422
    assert Repo.get(Category, category.id)
  end
end
