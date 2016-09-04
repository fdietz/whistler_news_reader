defmodule WhistlerNewsReader.FeedRefresher do

  alias WhistlerNewsReader.FeedFetcherWorker
  alias WhistlerNewsReader.StoreEntryHelper
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Repo

  require Logger

  def refresh(feed) do
    Logger.info "FeedRefresher - START refreshing feed id: #{feed.id}, title: #{feed.title}"

    # Try not using with statement or nested case statements
    # Since this will blow up memory
    # with {:ok, json_body} <- FeedFetcherWorker.fetch(feed.feed_url),
    #      do: parse(json_body)
    # {:ok, _updated_feed} = update_last_refreshed_at(feed)
    # StoreEntryHelper.store_entries(feed, parsed_attrs.entries)

    result = with {:ok, json_body}     <- FeedFetcherWorker.fetch(feed.feed_url),
                  {:ok, parsed_attrs}  <- ElixirFeedParser.parse(json_body),
                  {:ok, _updated_feed} <- update_last_refreshed_at(feed),
                  do: StoreEntryHelper.store_entries(feed, parsed_attrs.entries)

    Logger.info "FeedRefresher - DONE refreshing feed id: #{feed.id}, title: #{feed.title}"
    result
  end

  defp update_last_refreshed_at(feed) do
    feed
    |> Feed.changeset(%{last_refreshed_at: Ecto.DateTime.utc})
    |> Repo.update
  end
end
