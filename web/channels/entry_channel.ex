defmodule WhistlerNewsReader.EntryChannel do
  use WhistlerNewsReader.Web, :channel

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo

  def join("entries:all", _params, socket) do
    entries = Entry |> Repo.all |> Repo.preload(:feed)
    {:ok, %{entries: entries}, socket }
  end

  # def join("entries:all", _params, socket) do
  #   entries = [
  #     %{ id: 1 },
  #     %{ id: 2 },
  #   ]
  #   {:ok, %{entries: entries}, socket }
  # end

  # def join("entries:" <> entry_id, _params, socket) do
  #   {:ok, assign(socket, :entry_id, entry_id) }
  # end

  # def handle_in("new:todo", params, socket) do
  #   broadcast! socket, "new:todo", %{
  #     text: params["text"]
  #   }
  #
  #   {:reply, :ok, socket}
  # end
end
