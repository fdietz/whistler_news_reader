defmodule WhistlerNewsReader.FeedFetcher do

  def fetch(feed_url) do
    HTTPoison.start
    case HTTPoison.get(feed_url) do
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      {:ok, body}
    {:ok, %HTTPoison.Response{status_code: 404}} ->
      {:error, :not_found}
    {:error, %HTTPoison.Error{reason: reason}} ->
      IO.inspect reason
      {:error, reason}
    end
  end

end
