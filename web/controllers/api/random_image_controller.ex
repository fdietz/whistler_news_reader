defmodule WhistlerNewsReader.Api.RandomImageController do
  use WhistlerNewsReader.Web, :controller

  alias WhistlerNewsReader.RandomImageFetcher

  def index(conn, _params) do
    random_images = RandomImageFetcher.fetch

    conn
    |> put_status(:ok)
    |> render("index.json", random_images: random_images)
  end

end
