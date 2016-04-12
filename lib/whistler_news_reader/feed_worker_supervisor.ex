defmodule WhistlerNewsReader.FeedWorkerSupervisor do
  use Supervisor

  def start_link do
    Supervisor.start_link(__MODULE__, [])
  end

  def init([]) do
    pool_size = Application.get_env(:whistler_news_reader, :pool_size) || 50
    pool_options = [
      name: {:local, :worker_pool},
      worker_module: WhistlerNewsReader.FeedWorker,
      size: pool_size,
      max_overflow: 0
    ]

    children = [
      :poolboy.child_spec(:worker_pool, pool_options, [])
    ]

    supervise(children, strategy: :one_for_one)
  end
end
