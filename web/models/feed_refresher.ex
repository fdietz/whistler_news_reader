defmodule WhistlerNewsReader.FeedRefresher do

  alias WhistlerNewsReader.StoreEntryHelper
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.FeedFetcher

  require Logger

  def refresh(feed) do
    with {:ok, json_body}     <- FeedFetcher.fetch(feed.feed_url),
         {:ok, parsed_attrs}  <- ElixirFeedParser.parse(json_body),
         {:ok, _updated_feed} <- update_last_refreshed_at(feed),
         do: StoreEntryHelper.store_entries(feed, parsed_attrs.entries)

    Logger.info "FeedRefresher - refreshed feed id: #{feed.id}, title: #{feed.title}"

    {:ok, feed.id}
  end

  defp update_last_refreshed_at(feed) do
    feed
    |> Feed.changeset(%{last_refreshed_at: Ecto.DateTime.utc})
    |> Repo.update
  end
end
