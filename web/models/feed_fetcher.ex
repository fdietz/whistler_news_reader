defmodule WhistlerNewsReader.FeedFetcher do

  require Logger

  def fetch(feed_url) do
    case HTTPoison.get(feed_url) do
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      {:ok, body}
    {:ok, %HTTPoison.Response{status_code: 404}} ->
      {:error, :not_found}
    {:error, %HTTPoison.Error{reason: reason}} ->
      Logger.error(IO.inspect(reason))
      {:error, reason}
    end
  end

end
