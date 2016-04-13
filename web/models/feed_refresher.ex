defmodule WhistlerNewsReader.FeedRefresher do

  alias WhistlerNewsReader.FeedFetcher
  alias WhistlerNewsReader.FeedParser
  alias WhistlerNewsReader.StoreEntryHelper
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Repo

  require Logger

  def refresh(feed) do
    Logger.info "FeedRefresher - refreshing feed id: #{feed.id}, title: #{feed.title}"

    with {:ok, json_body}     <- FeedFetcher.fetch(feed.feed_url),
         {:ok, parsed_attrs}  <- FeedParser.parse(json_body),
         {:ok, _updated_feed} <- update_last_refreshed_at(feed),
         do: StoreEntryHelper.store_entries(feed, parsed_attrs.entries)
  end

  defp update_last_refreshed_at(feed) do
    feed
    |> Feed.changeset(%{last_refreshed_at: Ecto.DateTime.utc})
    |> Repo.update
  end
end
