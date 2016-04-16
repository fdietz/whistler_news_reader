defmodule WhistlerNewsReader.Api.RandomImageView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{random_images: random_images}) do
    %{random_images: render_many(random_images, WhistlerNewsReader.Api.RandomImageView, "random_image.json")}
  end

  def render("random_image.json", %{random_image: random_image}) do
    %{
        alt: random_image.alt,
        url: random_image.url
     }
  end
end
