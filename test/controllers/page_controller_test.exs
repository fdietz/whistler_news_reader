defmodule WhistlerNewsReader.PageControllerTest do
  use WhistlerNewsReader.ConnCase

  test "GET /" do
    conn = get conn(), "/"
    assert html_response(conn, 200) =~ "Whistler News Reader"
  end
end
