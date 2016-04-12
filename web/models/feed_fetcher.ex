defmodule WhistlerNewsReader.FeedFetcher do

  require Logger

  @user_agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
  @http_timeout_ms 60_000
  @max_retries 3
  @retry_sleep_ms 1_000

  def fetch(feed_url), do: fetch(feed_url, @max_retries)
  def fetch(_feed_url, 0), do: {:error, "failed after #{@max_retries} retries"}
  def fetch(feed_url, retries) when retries > 0 do
    if @max_retries - retries > 0 do
      Logger.debug "FeedFetcher - fetching #{feed_url} (#{@max_retries - retries} retries)"
    end

    case HTTPoison.get(feed_url, http_headers, options) do
      {:error, %HTTPoison.Error{reason: :timeout}} ->
        :timer.sleep(@retry_sleep_ms)
        fetch(feed_url, retries-1)
      {:error, %HTTPoison.Error{reason: :connect_timeout}} ->
        :timer.sleep(@retry_sleep_ms)
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
    [
      timeout: @http_timeout_ms,
      follow_redirect: true,
      max_redirect: 1
    ]
  end
end
