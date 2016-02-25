defmodule WhistlerNewsReader.Api.RegistrationControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User

  @valid_params %{
    email: "test@test.de",
    first_name: "Donald",
    last_name: "Duck",
    password: "password"
  }

  @invalid_params %{
    first_name: "Donald"
  }

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "CREATE /api/registrations succeeds", %{conn: conn} do
    conn = post conn, registration_path(conn, :create), user: @valid_params

    assert json_response(conn, 201)["user"]["id"]
    assert json_response(conn, 201)["jwt"]
    assert Repo.get_by(User, email: @valid_params.email)
  end

  test "CREATE /api/registrations fails", %{conn: conn} do
    conn = post conn, registration_path(conn, :create), user: @invalid_params
    assert json_response(conn, 422)["errors"]
  end

end
