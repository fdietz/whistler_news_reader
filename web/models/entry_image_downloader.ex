defmodule WhistlerNewsReader.EntryImageDownloader do
  @moduledoc """
  Download image
  """

  def download_url(url) do
    case HTTPoison.get(url) do
      {:ok, %HTTPoison.Response{body: body}} ->
        {:ok, body}
      {:error, %HTTPoison.Error{reason: reason}} ->
        {:error, reason}
    end
  end
end
