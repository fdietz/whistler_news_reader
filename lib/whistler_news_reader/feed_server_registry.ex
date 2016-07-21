defmodule WhistlerNewsReader.FeedServerRegistry do
  use GenServer

  alias WhistlerNewsReader.FeedServerWorker
  alias WhistlerNewsReader.FeedServerSupervisor

  def start_link do
    IO.puts "Start FeedServerRegistry"

    GenServer.start_link(__MODULE__, nil, name: :feed_server_registry)
  end

  def server_process(feed_server_name) do
    case FeedServerWorker.whereis(feed_server_name) do
      :undefined ->
        GenServer.call(:feed_server_registry, {:server_process, feed_server_name})
      pid -> pid
    end
  end

  def init(_) do
    {:ok, nil}
  end

  def handle_call({:server_process, feed_server_name}, _, state) do
    feed_server_pid = case FeedServerWorker.whereis(feed_server_name) do
      :undefined ->
        {:ok, pid} = FeedServerSupervisor.start_child(feed_server_name)
        pid
      pid -> pid
    end
    {:reply, feed_server_pid, state}
  end
end
