defmodule WhistlerNewsReader.EntryChannel do
  use WhistlerNewsReader.Web, :channel

  def join("entries:all", _params, socket) do
    entries = [
      %{ id: 1 },
      %{ id: 2 },
    ]
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
