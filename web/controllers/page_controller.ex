defmodule WhistlerNewsReader.PageController do
  use WhistlerNewsReader.Web, :controller

  def index(conn, _params) do
    # render conn, "index.html"
    conn
    |> put_layout(false)
    |> put_resp_content_type("text/html")
    |> text(File.read!("./priv/static/index.html"))
  end
end
