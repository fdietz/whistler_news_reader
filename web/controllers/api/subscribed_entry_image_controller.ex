defmodule WhistlerNewsReader.Api.SubscribedEntryImageController do
  use WhistlerNewsReader.Web, :controller

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.SubscribedEntry

  alias WhistlerNewsReader.EntryImageThumbnailer

  def show(conn, %{"id" => id} = params) do
    dimensions        = Map.get(params, "dimensions") || "200x200"
    subscribed_entry  = SubscribedEntry |> Repo.get!(id) |> Repo.preload(:entry)

    EntryImageThumbnailer.create(subscribed_entry, dimensions)

    case EntryImageThumbnailer.thumb_exists?(subscribed_entry, dimensions) do
      true ->
        {:ok, thumb_binary} = EntryImageThumbnailer.thumb_blob(subscribed_entry, dimensions)
        {:ok, content_type} = EntryImageThumbnailer.content_type(subscribed_entry, dimensions)

        conn
        |> put_resp_content_type(content_type, nil)
        |> send_resp(200, thumb_binary)
      false ->
        conn
        |> send_resp(404, "")
    end
  end

end
