defmodule WhistlerNewsReader.PageController do
  use WhistlerNewsReader.Web, :controller

  require Logger

  def index(conn, _params) do
    template = if System.get_env("WEBPACK_ENV") === "hot" do
      webpack_devserver
    else
      webpack_file_system
    end

    conn |> html(template)
  end


  def webpack_devserver do
    case HTTPoison.get("http://localhost:4001/index.html") do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        body
      other ->
        Logger.error "PageController - error retrieving template from webpack devserver"
        other
    end
  end

  def webpack_file_system do
    File.read!("./priv/static/index.html")
  end
end
