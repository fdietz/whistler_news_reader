defmodule WhistlerNewsReader.PageControllerTest do
  use WhistlerNewsReader.ConnCase

  import Mock

  @mock_template "<html><title>whistler news reader</title></html>"
  
  test "GET /" do
    with_mock WhistlerNewsReader.WebpackTemplateHelper, [webpack_file_system: fn -> @mock_template end] do
      conn = get build_conn(), "/"
      assert html_response(conn, 200) =~ "whistler news reader"
    end
  end
end
