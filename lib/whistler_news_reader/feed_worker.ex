defmodule WhistlerNewsReader.FeedWorker do
  use GenServer

  require Logger

  alias WhistlerNewsReader.FeedRefresher
  alias WhistlerNewsReader.FeedImporter

  @genserver_call_timeout 1_000_000
  @task_async_timeout     1_000_000
  @task_await_timeout     60_000

  def start_link(_) do
    GenServer.start_link(__MODULE__, nil, [])
  end

  def import_all(user, feed_attrs_enum) do
    feed_attrs_enum
    |> Enum.map(&import_async(user, &1))
    |> Enum.map(&Task.await(&1, @task_await_timeout))
  end

  def import(user, feed_attrs) do
    import_async(user, feed_attrs) |> Task.await(@task_await_timeout)
  end

  def import_async(user, feed_attrs) do
    Task.async fn ->
      :poolboy.transaction(:worker_pool, fn(server) ->
        GenServer.call(server, {:import, user, feed_attrs}, @genserver_call_timeout)
      end, @task_async_timeout)
    end
  end

  def refresh_all(feeds) do
    feeds
    |> Enum.map(&refresh_async(&1))
    |> Enum.map(&Task.await(&1, @task_await_timeout))
  end

  def refresh(feed) do
    refresh_async(feed) |> Task.await(@task_await_timeout)
  end

  def refresh_async(feed) do
    Task.async fn ->
      :poolboy.transaction(:worker_pool, fn(server) ->
        GenServer.call(server, {:refresh, feed}, @genserver_call_timeout)
      end, @task_async_timeout)
    end
  end

  def handle_call({:import, user, feed_attrs}, _from, state) do
    {:reply, FeedImporter.import(user, feed_attrs), state}
  end

  def handle_call({:refresh, feed}, _from, state) do
    {:reply, FeedRefresher.refresh(feed), state}
  end

end
