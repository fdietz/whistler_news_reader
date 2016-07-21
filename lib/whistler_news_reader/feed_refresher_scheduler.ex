defmodule WhistlerNewsReader.FeedRefresherScheduler do
  use GenServer
  import Logger

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.FeedServer

  @sleep_sec 3600 # 1 hour

  def start_link do
    GenServer.start_link(__MODULE__, nil, name: WhistlerNewsReader.FeedRefresherScheduler)
  end

  def init(state) do
    sleep
    {:ok, state}
  end

  def handle_info(:work, state) do
    process_task
    sleep
    {:noreply, state}
  end

  # TODO: paginate feeds
  def process_task do
    Logger.debug "FeedRefresherScheduler - process_task"
    feeds = Repo.all(Feed)
    FeedServer.refresh_all(feeds)
  end

  def sleep do
    Logger.info "FeedRefresherScheduler - waking up in #{@sleep_sec} seconds"
    Process.send_after(self, :work, @sleep_sec * 1000)
  end

end
