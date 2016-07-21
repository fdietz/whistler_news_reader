defmodule WhistlerNewsReader.FeedServerSupervisor do
  use Supervisor

  def start_link do
    Supervisor.start_link(__MODULE__, nil, name: :feed_server_supervisor)
  end

  def start_child(feed_server_name) do
    Supervisor.start_child(:feed_server_supervisor, [feed_server_name])
  end

  def init(_) do
    supervise([worker(WhistlerNewsReader.FeedServerWorker, [])], strategy: :simple_one_for_one)
  end
end
