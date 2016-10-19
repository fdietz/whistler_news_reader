defmodule WhistlerNewsReader.FeedRefresher do

  alias WhistlerNewsReader.StoreEntryHelper
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.FeedFetcher

  require Logger

  def refresh(feed) do
    case FeedFetcher.fetch(feed.feed_url) do
      {:ok, json_body} ->
        case ElixirFeedParser.parse(json_body) do
          {:ok, parsed_attrs} ->
            {:ok, _updated_feed} = update_last_refreshed_at(feed)
            entries = StoreEntryHelper.store_entries(feed, parsed_attrs.entries)

            Logger.info "FeedRefresher - refreshed feed id: #{feed.id}, title: #{feed.title}, new entries: #{inspect(entries)}"

            {:ok, feed.id, entries}
          other ->
            Logger.error "FeedRefresher - Error refreshing feed id: #{feed.id}, title: #{feed.title}: #{inspect(other)}"
            {:error}
        end
      other ->
        Logger.error "FeedRefresher - Error refreshing feed id: #{feed.id}, title: #{feed.title}: #{inspect(other)}"
        {:error}
    end
  end

  defp update_last_refreshed_at(feed) do
    feed
    |> Feed.changeset(%{last_refreshed_at: Ecto.DateTime.utc})
    |> Repo.update
  end
end
