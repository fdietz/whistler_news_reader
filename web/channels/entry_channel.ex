defmodule WhistlerNewsReader.EntryChannel do
  use WhistlerNewsReader.Web, :channel

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo

  def join("entries:all", _params, socket) do
    entries = Entry |> Entry.sorted |> Entry.limit(10) |> Repo.all |> Repo.preload(:feed)
    {:ok, %{entries: entries}, socket }
  end

  def handle_in("entries:load_more", %{"last_published" => last_published} = _params, socket) do
    entries = Entry |> Entry.sorted |> Entry.load_more(last_published, 10) |> Repo.all |> Repo.preload(:feed)
    {:reply, {:ok, %{entries: entries} }, socket}
  end
end
