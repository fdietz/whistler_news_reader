defmodule WhistlerNewsReader.Api.SessionControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User

  @valid_params %{
    email: "test@test.de",
    first_name: "Donald",
    last_name: "Duck",
    password: "password"
  }

  setup do
    changeset = User.changeset(%User{}, @valid_params)
    user = Repo.insert!(changeset)

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, user: user}
  end

  test "CREATE /api/sessions succeeds", %{conn: conn, user: user} do
    conn = post conn, session_path(conn, :create), session: %{ email: "test@test.de", password: "password" }

    assert conn.status == 201
    assert json_response(conn, 201)["user"]["id"] == user.id
    assert json_response(conn, 201)["jwt"]
  end

  test "CREATE /api/sessions fails", %{conn: conn} do
    conn = post conn, session_path(conn, :create), session: %{ email: "test@test.de", password: "wrong password" }

    assert conn.status == 422
    assert json_response(conn, 422)["error"] == "invalid email or password"
  end
end