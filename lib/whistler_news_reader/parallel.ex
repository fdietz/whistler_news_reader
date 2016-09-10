defmodule WhistlerNewsReader.Parallel do
  @moduledoc """
  Runs a number of jobs (with an upper bound) in parallel and
  awaits them to finish.

  Code from https://github.com/hexpm/hex/blob/88190bc6ed7f4a95d91aa32a4c2fb642febc02df/lib/hex/parallel.ex
  """

  use GenServer

  require Logger

  def start_link(name, opts) do
    GenServer.start_link(__MODULE__, new_state(opts), name: name)
  end

  @spec run(GenServer.server, any, (() -> any)) :: :ok
  def run(name, id, fun) do
    GenServer.cast(name, {:run, id, fun})
  end

  @spec await(GenServer.server, any, timeout) :: any
  def await(name, id, timeout) do
    GenServer.call(name, {:await, id}, timeout)
  end

  def clear(name) do
    GenServer.call(name, :clear)
  end

  def debug(name) do
    GenServer.call(name, :debug)
  end

  def handle_cast({:run, id, fun}, state) do
    state = run_task(id, fun, state)
    {:noreply, state}
  end

  def handle_call({:await, id}, from, state) do
    if result = state.finished[id] do
      state = %{state | finished: Map.delete(state.finished, id)}
      {:reply, result, state}
    else
      state = %{state | waiting_reply: Map.put(state.waiting_reply, id, from)}
      {:noreply, state}
    end
  end

  def handle_call(:clear, _from, state) do
    Enum.each(state.running, fn {%Task{pid: pid}, _} ->
      Process.exit(pid, :stop)
    end)

    state = %{state | running: %{}, finished: %{}, waiting: :queue.new, waiting_reply: %{}}
    {:reply, :ok, state}
  end

  def handle_call(:debug, _from, state) do
    running = Map.keys(state.running)
    Logger.info "Parallel - Tasks Running: #{inspect running}"

    {:reply, {:ok, state}, state}
  end

  def handle_info({ref, message}, state) when is_reference(ref) do
    tasks = Map.keys(state.running)

    if task = Enum.find(tasks, &(&1.ref == ref)) do
      id = state.running[task]
      state = %{state | running: Map.delete(state.running, task)}

      state =
        if from = state.waiting_reply[id] do
          GenServer.reply(from, message)
          %{state | waiting_reply: Map.delete(state.waiting_reply, id)}
        else
          %{state | finished: Map.put(state.finished, id, message)}
        end

      state =
        case :queue.out(state.waiting) do
          {{:value, {id, fun}}, waiting} ->
            state = %{state | waiting: waiting}
            run_task(id, fun, state)
          {:empty, _} ->
            state
        end

      {:noreply, state}
    else
      {:noreply, state}
    end
  end

  def handle_info({:DOWN, ref, _, proc, reason}, state) do
    tasks = Map.keys(state.running)

    if Enum.find(tasks, &(&1.ref == ref)) do
      {:stop, {proc, reason}, state}
    else
      {:noreply, state}
    end
  end

  defp run_task(id, fun, state) do
    if Map.size(state.running) >= state.max_jobs do
      %{state | waiting: :queue.in({id, fun}, state.waiting)}
    else
      parent = self()
      task = Task.async(fn ->
        Ecto.Adapters.SQL.Sandbox.allow(WhistlerNewsReader.Repo, parent, self())
        fun.()
      end)
      %{state | running: Map.put(state.running, task, id)}
    end
  end

  defp new_state(opts) do
    %{max_jobs: opts[:max_parallel] || 10,
      running: %{},
      finished: %{},
      waiting: :queue.new,
      waiting_reply: %{}}
  end
end
