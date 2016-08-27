defmodule WhistlerNewsReader.FeedFetcherWorkerSupervisor do
  use Supervisor

  @pool_size 10

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init([]) do
    pool_size = Application.get_env(:whistler_news_reader, :pool_size) || @pool_size
    pool_options = [
      name: {:local, :feed_fetcher_worker_pool},
      worker_module: WhistlerNewsReader.FeedFetcherWorker,
      size: pool_size,
      max_overflow: 0
    ]

    children = [
      :poolboy.child_spec(:feed_fetcher_worker_pool, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end
end
