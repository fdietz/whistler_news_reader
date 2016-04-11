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
         do: store_entries(feed, parsed_feed.entries)
  end

  defp store_entries(feed, entries) do
    Enum.each(entries, fn(entry) ->
      case StoreEntryHelper.store_entry(feed, entry) do
        {:ok, :skipping} ->
          Logger.info "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} skip"
        {:ok, _new_entry} ->
          Logger.info "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} success"
        {:error, %Ecto.Changeset{} = changeset} ->
          Logger.info "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} changeset error: #{inspect changeset.errors}"
        {:error, error} ->
          Logger.error "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} error: #{inspect error}"
      end
    end)
  end

end
