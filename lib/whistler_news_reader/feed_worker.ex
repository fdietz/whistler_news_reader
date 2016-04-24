defmodule WhistlerNewsReader.FeedWorker do
  use GenServer

  require Logger

  alias WhistlerNewsReader.FeedRefresher
  alias WhistlerNewsReader.FeedImporter

  @genserver_call_timeout_ms 1_000_000
  @task_async_timeout_ms     1_000_000
  @task_await_timeout_ms     60_000

  def start_link(_) do
    GenServer.start_link(__MODULE__, nil, [])
  end

  def import_all(user, feed_attrs_enum, opts \\ []) do
    feed_attrs_enum
    |> Enum.map(&import_async(user, &1, opts))
    |> Enum.map(&Task.await(&1, @task_await_timeout_ms))
  end

  def import(user, feed_attrs, opts \\ []) do
    import_async(user, feed_attrs, opts) |> Task.await(@task_await_timeout_ms)
  end

  def import_async(user, feed_attrs, opts) do
    Task.async fn ->
      :poolboy.transaction(:feed_worker_pool, fn(server) ->
        GenServer.call(server, {:import, user, feed_attrs, opts}, @genserver_call_timeout_ms)
      end, @task_async_timeout_ms)
    end
  end

  def refresh_all(feeds) do
    feeds
    |> Enum.map(&refresh_async(&1))
    |> Enum.map(&Task.await(&1, @task_await_timeout_ms))
  end

  def refresh(feed) do
    refresh_async(feed) |> Task.await(@task_await_timeout_ms)
  end

  def refresh_async(feed) do
    Task.async fn ->
      :poolboy.transaction(:feed_worker_pool, fn(server) ->
        GenServer.call(server, {:refresh, feed}, @genserver_call_timeout_ms)
      end, @task_async_timeout_ms)
    end
  end

  def handle_call({:import, user, feed_attrs, opts}, _from, state) do
    {:reply, FeedImporter.import(user, feed_attrs, opts), state}
  end

  def handle_call({:refresh, feed}, _from, state) do
    {:reply, FeedRefresher.refresh(feed), state}
  end

end
