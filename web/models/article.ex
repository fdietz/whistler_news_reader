defmodule WhistlerNewsReader.Article do

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
    |> Floki.find("article, p, body")
    |> Enum.map(fn x -> Floki.text(x, deep: false) end)
    |> Enum.map(&normalize_whitespace/1)
    |> Enum.filter(&is_relevant?/1)
    |> Enum.join("\n\n")
  end

  def normalize_whitespace(text) do
    text
    |> String.replace(~r/\s+/, " ")
    |> String.replace(~r/\s+/, " ")
    |> String.strip
  end

  def is_relevant?(text) do
    (String.length(text) > 30) &&
    (String.contains?(text, [". ","? ", "! ", "\" ", "\", ", ": "]))
  end

  defp attr(element, name) do
    Enum.at(Floki.attribute(element, name), 0)
  end
end
