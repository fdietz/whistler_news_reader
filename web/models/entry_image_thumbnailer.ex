defmodule WhistlerNewsReader.EntryImageThumbnailer do
  @moduledoc """
  Create image thumbnails
  """

  alias WhistlerNewsReader.EntryImageExtractor
  alias WhistlerNewsReader.ImageProcessor
  alias WhistlerNewsReader.EntryImageDownloader
  alias WhistlerNewsReader.EntryImageStorage

  require Logger

  def create(subscribed_entry, dimensions) do
    unless thumb_exists?(subscribed_entry, dimensions) do
      case download_original_image(subscribed_entry) do
        {:ok, image_path} ->
          thumb_path = EntryImageStorage.thumb_path(subscribed_entry.id, dimensions)
          ImageProcessor.thumb(image_path, thumb_path, dimensions)
        other ->
          other
      end
    end
  end

  def original_exists?(subscribed_entry) do
    image_path = EntryImageStorage.image_path(subscribed_entry.id)
    File.exists?(image_path)
  end

  def thumb_exists?(subscribed_entry, dimensions) do
    thumb_path = EntryImageStorage.thumb_path(subscribed_entry.id, dimensions)
    File.exists?(thumb_path)
  end

  def thumb_blob(subscribed_entry, dimensions) do
    thumb_path = EntryImageStorage.thumb_path(subscribed_entry.id, dimensions)
    File.read(thumb_path)
  end

  def content_type(subscribed_entry, dimensions) do
    thumb_path = EntryImageStorage.thumb_path(subscribed_entry.id, dimensions)
    ImageProcessor.content_type(thumb_path)
  end

  defp download_original_image(subscribed_entry) do
    if original_exists?(subscribed_entry) do
      {:ok, EntryImageStorage.image_path(subscribed_entry.id)}
    else
      case EntryImageExtractor.extract_url(subscribed_entry) do
        {:ok, url} ->
          case EntryImageDownloader.download_url(url) do
            {:ok, image_blob} ->
              {:ok, image_path} = EntryImageStorage.store(subscribed_entry.id, image_blob)
            {:error, reason} ->
              Logger.info "EntryImageThumbnailer - Download original image failed for entry #{subscribed_entry.id} at #{url}: #{inspect(reason)}"
          end
        other ->
          other
      end
    end
  end
end
