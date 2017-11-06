defmodule WhistlerNewsReader.FeedServer do

  @moduledoc """
  Encapsulates refresh and import feed async/await tasks.
  WhistlerNewsReader.FeedServer.refresh_all(WhistlerNewsReader.Repo.all(WhistlerNewsReader.Feed))
  """


  require Logger

  alias WhistlerNewsReader.FeedImporter
  alias WhistlerNewsReader.FeedRefresher
  alias WhistlerNewsReader.EntryImageThumbnailer

  def refresh_all(feeds) do
    Enum.each(feeds, fn(feed) ->
      WhistlerNewsReader.Parallel.run(:feed_server, "feed_#{feed.id}", fn ->
        refresh(feed)
      end)
    end)
  end

  def refresh(feed) do
    case FeedRefresher.refresh(feed) do
      {:ok, _feed_id, entries} ->
        Enum.each(entries, fn(entry) ->
          WhistlerNewsReader.Parallel.run(:feed_server, "entry_#{entry.id}", fn ->
            EntryImageThumbnailer.create(entry, "200x200")
          end)
        end)
      other ->
        other
    end
  end

  # run in parallel
  def import_all(user, feed_attrs_enum, opts \\ []) do
    Enum.each(feed_attrs_enum, fn(feed_attrs) ->
      WhistlerNewsReader.Parallel.run(:feed_server, feed_attrs["feed_url"], fn ->
        import(user, feed_attrs, opts)
      end)
    end)
  end

  def import(user, feed_attrs, opts \\ []) do
    try do
      FeedImporter.import(user, feed_attrs, opts)
    catch _,reason ->
      {:error, inspect reason}
    end
  end

end
