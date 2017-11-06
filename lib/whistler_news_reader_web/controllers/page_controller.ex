defmodule WhistlerNewsReaderWeb.PageController do
  use WhistlerNewsReaderWeb, :controller

  alias WhistlerNewsReader.WebpackTemplateHelper

  def index(conn, _params) do
    template = if System.get_env("WEBPACK_ENV") === "hot" do
      WebpackTemplateHelper.webpack_devserver
    else
      WebpackTemplateHelper.webpack_file_system
    end

    conn |> html(template)
  end

end
