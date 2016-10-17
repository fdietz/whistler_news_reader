defmodule WhistlerNewsReader.EntryImageStorage do
  @moduledoc """
  Storage for images
  """

  def store(entry_id, image_blob) do
    File.mkdir_p!(dir_path)

    File.write!(image_path(entry_id), image_blob)

    {:ok, image_path(entry_id)}
  end

  def read(entry_id) do
    File.read!(image_path(entry_id))
  end

  def read(entry_id, dimensions) do
    File.read!(thumb_path(entry_id, dimensions))
  end

  def dir_path do
    Path.expand("../../tmp/images", __DIR__)
  end

  def image_path(entry_id) do
    Path.expand("../../tmp/images/#{entry_id}.jpg", __DIR__)
  end

  def thumb_path(entry_id, dimensions) do
    Path.expand("../../tmp/images/#{entry_id}_#{dimensions}.jpg", __DIR__)
  end

end
