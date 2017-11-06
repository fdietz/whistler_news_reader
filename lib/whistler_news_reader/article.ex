defmodule WhistlerNewsReader.Article do
  @moduledoc """
  Parse HTML to identify relevant content using heuristics
  """

  alias WhistlerNewsReader.FeedFetcher

  def scrape(url) do
    case FeedFetcher.fetch(url) do
      {:ok, body} ->
        scrape_article(body)
      other ->
        other
    end
  end

  def scrape_article(body) do
    body
    |> Floki.find("article, .article, .content, .entry, .main, .post, .text")
    |> Floki.find("figure, p, q, blockquote, h1, h2")
    |> Enum.map(fn x ->
      node_name = elem(x, 0)
      case node_name do
        "figure" ->
          Floki.raw_html(x)
        "p" ->
          if is_relevant?(Floki.text(x, deep: false)) do
            Floki.raw_html(x)
          else
            ""
          end
        _other ->
          ""
      end
    end)
    |> Enum.join
  end

  def is_relevant?(text) do
    (String.length(text) > 30) &&
    (String.contains?(text, [". ","? ", "! ", ", ", "; ", ": "]))
  end

end
