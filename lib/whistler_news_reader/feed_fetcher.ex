defmodule WhistlerNewsReader.FeedFetcher do
  @moduledoc """
  Fetch feed from url using HTTPoison
  """

  require Logger

  @user_agent "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
  @http_timeout_ms 1_000

  def fetch(feed_url) do
    case HTTPoison.get(feed_url, http_headers, options) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, body}
      {:ok, %HTTPoison.Response{status_code: status_code}} ->
        {:error, status_code}
      {:error, %HTTPoison.Error{reason: reason}} ->
        Logger.error(inspect(reason))
        {:error, reason}
      other ->
        other
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
