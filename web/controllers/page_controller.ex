defmodule WhistlerNewsReader.PageController do
  use WhistlerNewsReader.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
