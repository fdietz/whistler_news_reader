defmodule WhistlerNewsReader.Api.FeedController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry

  def index(conn, %{} = _params) do
    feeds = Feed |> Repo.all
    render(conn, "index.json", feeds: feeds)
  end
end
