defmodule WhistlerNewsReader.FeedWorker do
  use GenServer

  require Logger

  alias WhistlerNewsReader.FeedRefresher

  @genserver_call_timeout 1_000_000
  @task_async_timeout     1_000_000
  @task_await_timeout     60_000

  def start_link(_) do
    GenServer.start_link(__MODULE__, nil, [])
  end

  def refresh_all(feeds) do
    feeds
    |> Enum.map(&refresh(&1))
    |> Enum.map(&Task.await(&1, @task_await_timeout))
  end

  def refresh(feed) do
    Task.async fn ->
      :poolboy.transaction(:worker_pool, fn(server) ->
        GenServer.call(server, {:refresh_feed, feed}, @genserver_call_timeout)
      end, @task_async_timeout)
    end
  end

  def handle_call({:refresh_feed, feed}, _from, state) do
    {:reply, FeedRefresher.refresh(feed), state}
  end

end
