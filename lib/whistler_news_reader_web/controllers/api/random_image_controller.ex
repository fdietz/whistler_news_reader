defmodule WhistlerNewsReaderWeb.Api.RandomImageController do
  use WhistlerNewsReaderWeb, :controller

  alias WhistlerNewsReader.RandomImageFetcher

  def index(conn, _params) do
    random_images = RandomImageFetcher.fetch

    conn
    |> put_status(:ok)
    |> render("index.json", random_images: random_images)
  end

end
