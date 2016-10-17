defmodule WhistlerNewsReader.ImageProcessor do
  @moduledoc """
  Generate thumbnail of image
  """

  import Mogrify

  # TODO: support animated GIFs
  # TODO: store filename and respect file type
  # TODO: return correct content_type
  def thumb(original_image_path, thumb_path, dimensions) do
    original_image_path
    |> open()
    |> resize_to_limit(dimensions)
    |> format("jpeg")
    |> save(path: thumb_path)

    {:ok, "image/jpeg"}
  end

  def content_type(image_path) do
    %Mogrify.Image{format: format} = image_path
    |> open()
    |> verbose

    {:ok, "image/#{format}"}
  end

end
