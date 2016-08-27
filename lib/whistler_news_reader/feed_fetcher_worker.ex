defmodule WhistlerNewsReader.FeedFetcherWorker do
  use GenServer

  require Logger

  @genserver_call_timeout_ms 1_000_000
  @pool_transaction_timeout_ms 1_000_000

  def start_link(_) do
    GenServer.start_link(__MODULE__, nil, [])
  end

  def fetch(feed_url) do
    :poolboy.transaction(:feed_fetcher_worker_pool, fn(server) ->
      GenServer.call(server, {:fetch, feed_url}, @genserver_call_timeout_ms)
    end, @pool_transaction_timeout_ms)
  end

  def handle_call({:fetch, feed_url}, _from, state) do
    result = WhistlerNewsReader.FeedFetcher.fetch(feed_url)
    {:reply, result, state}
  end

end
