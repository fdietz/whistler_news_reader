defmodule WhistlerNewsReader.FeedRefresher do

  alias WhistlerNewsReader.FeedFetcher
  alias WhistlerNewsReader.FeedParser
  alias WhistlerNewsReader.StoreEntryHelper

  require Logger

  def refresh_all(feeds) do
    Enum.each(feeds, fn(feed) ->
      refresh(feed)
    end)
  end

  def refresh(feed) do
    Logger.info "FeedRefresher - refreshing feed id: #{feed.id}, title: #{feed.title}"

    with {:ok, json_body}   <- FeedFetcher.fetch(feed.feed_url),
         {:ok, parsed_feed} <- FeedParser.parse(json_body),
         do: StoreEntryHelper.store_entries(feed, parsed_feed.entries)
  end

end
