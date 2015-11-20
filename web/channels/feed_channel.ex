defmodule WhistlerNewsReader.FeedChannel do
  use WhistlerNewsReader.Web, :channel

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Repo

  def join("feeds:all", _params, socket) do
    feeds = Feed |> Repo.all
    {:ok, %{feeds: feeds}, socket }
  end

end
