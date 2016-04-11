defmodule WhistlerNewsReader.FeedFetcher do

  require Logger

  def fetch(feed_url) do
    Logger.info "FeedFetcher - Fetching #{feed_url}"

    case HTTPoison.get(feed_url) do
    {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      {:ok, body}
    {:ok, %HTTPoison.Response{status_code: 404}} ->
      {:error, :not_found}
    {:ok, %HTTPoison.Response{status_code: 500}} ->
      {:error, :internal_error}
    {:ok, %HTTPoison.Response{status_code: status_code}} ->
      {:error, status_code}
    {:tls_alert, _} ->
      {:error, "tls_alert, bad certificate"}
    {:error, %HTTPoison.Error{reason: reason}} ->
      Logger.error(inspect(reason))
      {:error, reason}
    end
  end

end
