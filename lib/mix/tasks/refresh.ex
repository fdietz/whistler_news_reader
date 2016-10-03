defmodule Mix.Tasks.WhistlerNewsReader.Refresh do
  use Mix.Task
  import Mix.Ecto

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.FeedServer

  def run(args) do
    repos = parse_repo(args)

    Enum.each repos, fn repo ->
      ensure_repo(repo, args)
      {:ok, pid, _} = ensure_started(repo, all: true)

      feeds = repo.all(Feed)
      FeedServer.refresh_all(feeds)
    end
  end
end
