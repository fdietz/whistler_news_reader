defmodule WhistlerNewsReader.Api.EntryArticleController do
  use WhistlerNewsReader.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: WhistlerNewsReader.Api.SessionController

  alias WhistlerNewsReader.SubscribedEntry
  alias WhistlerNewsReader.Article

  def show(conn, %{"id" => id}) do
    subscribed_entry = SubscribedEntry |> SubscribedEntry.for_user_id(current_user(conn).id) |> Repo.get!(id) |> Repo.preload(:entry)

    content = Article.scrape(subscribed_entry.entry.url)
    entry_article = %{ content: content }

    conn
    |> render("show.json", entry_article: entry_article)
  end

  defp current_user(conn) do
    Guardian.Plug.current_resource(conn)
  end
end
