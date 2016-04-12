defmodule WhistlerNewsReader.FeedFetcher do

  require Logger

  @user_agent "Chrome/45.0.2454.101 Safari/537.36"
  @http_timeout 60_000
  @max_retries 3
  @retry_sleep 1_000

  def fetch(feed_url), do: fetch(feed_url, @max_retries)
  def fetch(feed_url, 0), do: {:error, "failed after #{@max_retries} retries"}
  def fetch(feed_url, retries) when retries > 0 do
    Logger.debug "FeedFetcher - fetching #{feed_url} for #{@max_retries - retries} time"

    case HTTPoison.get(feed_url, http_headers, options) do
      {:error, %HTTPoison.Error{reason: :timeout}} ->
        :timer.sleep(@retry_sleep)
        fetch(feed_url, retries-1)
      response ->
        map_response(response)
    end
  end

  def map_response(response) do
    case response do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, body}
      {:ok, %HTTPoison.Response{status_code: status_code}} ->
        {:error, status_code}
      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error(inspect(reason))
        {:error, reason}
      _ ->
        response
    end
  end

  defp http_headers do
    [{"User-Agent", user_agent}]
  end

  defp user_agent do
    Application.get_env(:whistler_news_reader, :user_agent) || @user_agent
  end

  defp options do
    [timeout: @http_timeout]
  end
end
