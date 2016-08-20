defmodule WhistlerNewsReader.PageControllerTest do
  use WhistlerNewsReader.ConnCase

  test "GET /" do
    conn = get build_conn(), "/"
    assert html_response(conn, 200) =~ "whistler news reader"
  end
end
