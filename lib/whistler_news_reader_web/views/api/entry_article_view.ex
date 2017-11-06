defmodule WhistlerNewsReaderWeb.Api.EntryArticleView do
  use WhistlerNewsReaderWeb, :view

  def render("show.json", %{entry_article: entry_article}) do
    %{entry_article: render_one(entry_article, WhistlerNewsReaderWeb.Api.EntryArticleView, "entry_article.json")}
  end

  def render("entry_article.json", %{entry_article: entry_article}) do
    %{
      content: entry_article.content
     }
  end
end
