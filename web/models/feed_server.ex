defmodule WhistlerNewsReader.FeedServer do

  @moduledoc """
  Encapsulates refresh and import feed async/await tasks.
  """

  require Logger

  alias WhistlerNewsReader.FeedImporter
  alias WhistlerNewsReader.FeedRefresher

  def refresh_all(feeds) do
    Enum.each(feeds, fn(feed) ->
      WhistlerNewsReader.Parallel.run(:feed_server, feed.id, fn ->
        refresh(feed)
      end)
    end)
  end

  def refresh(feed) do
    FeedRefresher.refresh(feed)
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
