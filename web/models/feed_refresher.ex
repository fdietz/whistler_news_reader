defmodule WhistlerNewsReader.FeedRefresher do

  alias WhistlerNewsReader.FeedFetcher
  alias WhistlerNewsReader.FeedParser
  require Logger

  def refresh_all(feeds) do
    Enum.each(feeds, fn(feed) ->
      refresh(feed)
    end)
  end

  def refresh(feed) do
    Logger.info "Refresh feed id: #{feed.id}, title: #{feed.title}"

    {:ok, json_body}   = FeedFetcher.fetch(feed.feed_url)
    parsed_feed        = FeedParser.parse(json_body)

    Enum.each(parsed_feed.entries, fn(entry) ->
      case WhistlerNewsReader.StoreEntryHelper.store_entry(feed, entry) do
        {:ok, _new_entry} ->
          Logger.info "Refresh feed id: #{feed.id}, entry id: #{entry.id} success"
        {:skipping} ->
          Logger.info "Refresh feed id: #{feed.id}, entry id: #{entry.id} skip"
        {:error, changeset} ->
          Logger.info "Refresh feed id: #{feed.id}, entry id: #{entry.id} error: #{inspect changeset.errors}"
      end
    end)
  end

end
