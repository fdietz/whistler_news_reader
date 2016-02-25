defmodule WhistlerNewsReader.Api.SessionControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User

  @valid_params %{
    email: "test@test.de",
    first_name: "Donald",
    last_name: "Duck",
    encrypted_password: "password"
  }

  # test "GET /", %{conn: conn} do
  #   conn = get conn, feed_path(conn, :index)
  #   IO.puts conn.req_headers
  #   IO.puts conn.resp_body
  #   IO.puts conn.status
  #
  #   assert conn.status == 200
  #   assert json_response(conn, 200)["id"] == "test"
  # end
  
end
