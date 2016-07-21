# use WhistlerNewsReader.Feed#id as server process name
#   pid = FeedServerRegistry.server_process("1")
#   FeedServerWorker.refresh(pid)
defmodule WhistlerNewsReader.FeedServerWorker do
  use GenServer

  alias WhistlerNewsReader.FeedRefresher

  def start_link(name) do
    GenServer.start_link(WhistlerNewsReader.FeedServerWorker, name, name: via_tuple(name))
  end

  def whereis(name) do
    :gproc.whereis_name({:n, :l, {:feed_server_worker, name}})
  end

  def refresh(worker) do
    GenServer.call(worker, {:refresh})
  end

  def init(name) do
    {:ok, {name, {}}}
  end

  defp via_tuple(name) do
    {:via, :gproc, {:n, :l, {:feed_server_worker, name}}}
  end

  def handle_call({:refresh}, _from, {name, {}} = state) do
    feed = WhistlerNewsReader.Repo.get!(WhistlerNewsReader.Feed, name)
    {:reply, FeedRefresher.refresh(feed), state}
  end

  def handle_info(:stop, state), do: {:stop, :normal, state}
  def handle_info(_, state), do: {:noreply, state}
end
