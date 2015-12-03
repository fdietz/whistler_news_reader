defmodule WhistlerNewsReader.EntryChannel do
  use WhistlerNewsReader.Web, :channel

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo

  def join("entries:join", _params, socket) do
    # entries = Entry |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    {:ok, %{}, socket }
  end

  def handle_in("entries:all", _params, socket) do
    entries = Entry |> Entry.sorted |> Entry.limit(20) |> Repo.all |> Repo.preload(:feed)
    {:reply, {:ok, %{entries: entries} }, socket }
  end

  def handle_in("entries:load_more", %{"last_published" => last_published} = _params, socket) do
    entries = Entry |> Entry.sorted |> Entry.load_more(last_published, 20) |> Repo.all |> Repo.preload(:feed)
    {:reply, {:ok, %{entries: entries} }, socket}
  end
end
