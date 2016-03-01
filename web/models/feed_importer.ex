defmodule WhistlerNewsReader.FeedImporter do

  alias WhistlerNewsReader.FeedFetcher

  def import_with_feed_url(feed_url) do
    case FeedFetcher.fetch(feed_url) do
      {:ok, body} ->
        {:ok, ElixirFeedParser.parse(body)}
      {:error, reason} ->
        {:error, reason}
    end
  end

end
