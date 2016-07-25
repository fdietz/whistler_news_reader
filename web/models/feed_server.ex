defmodule WhistlerNewsReader.FeedServer do

  alias WhistlerNewsReader.FeedServerRegistry
  alias WhistlerNewsReader.FeedServerWorker
  alias WhistlerNewsReader.FeedImporter

  @task_await_timeout_ms 60_000

  # run in parallel
  def refresh_all(feeds) do
    feeds
    |> Enum.map(&refresh_async(&1))
    |> Enum.map(&Task.await(&1, @task_await_timeout_ms))
    feeds |> Enum.map(&refresh(&1))
  end

  defp refresh_async(feed) do
    Task.async(fn ->
      try do
        refresh(feed)
      catch _,_ ->
        :error
      end
    end)
    Task.async(fn -> refresh(feed) end)
  end

  def refresh(feed) do
    pid = FeedServerRegistry.server_process(feed.id)
    FeedServerWorker.refresh(pid)
  end

  # run in parallel
  def import_all(user, feed_attrs_enum, opts \\ []) do
    feed_attrs_enum
    |> Enum.map(&import_async(user, &1, opts))
    |> Enum.map(&Task.await(&1, @task_await_timeout_ms))
  end

  defp import_async(user, feed_attrs, opts) do
    Task.async(fn ->
      try do
        import(user, feed_attrs, opts)
      catch _,_ ->
        :error
      end
    end)
  end

  def import(user, feed_attrs, opts \\ []) do
    FeedImporter.import(user, feed_attrs, opts)
  end

end
