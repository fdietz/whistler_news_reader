defmodule WhistlerNewsReader.FeedServer do

  alias WhistlerNewsReader.FeedServerRegistry
  alias WhistlerNewsReader.FeedServerWorker
  alias WhistlerNewsReader.FeedImporter

  @task_await_timeout_ms 60_000

  def refresh_all(feeds) do
    feeds
    |> Enum.map(&refresh_async(&1))
    |> Enum.map(&Task.await(&1, @task_await_timeout_ms))
  end

  def refresh_async(feed) do
    Task.async(fn -> refresh(feed) end)
  end

  def refresh(feed) do
    pid = FeedServerRegistry.server_process(feed.id)
    FeedServerWorker.refresh(pid)
  end

  def import_all(user, feed_attrs_enum, opts \\ []) do
    feed_attrs_enum
    |> Enum.map(&import_async(user, &1, opts))
    |> Enum.map(&Task.await(&1, @task_await_timeout_ms))
  end

  def import_async(user, feed_attrs, opts) do
    Task.async(fn -> import(user, feed_attrs, opts) end)
  end

  def import(user, feed_attrs, opts \\ []) do
    FeedImporter.import(user, feed_attrs, opts)
  end

end
