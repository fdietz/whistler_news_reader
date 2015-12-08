defmodule WhistlerNewsReader.Api.EntryController do
  use WhistlerNewsReader.Web, :controller
  require Logger

  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry

  def index(conn, %{"last_published" => last_published} = _params) do
    entries = Entry |> Entry.sorted |> Entry.load_more(last_published, 20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end

  def index(conn, %{} = _params) do
    entries = Entry |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    render(conn, "index.json", entries: entries)
  end
end
