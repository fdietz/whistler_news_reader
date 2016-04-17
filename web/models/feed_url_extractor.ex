defmodule WhistlerNewsReader.FeedUrlExtractor do

  def extract(html) do
    case Floki.find(html, "link[type='application/rss+xml']") do
      [] ->
        {:error, :feed_url_not_found}
      [feed_url] ->
        {:ok, Enum.at(Floki.attribute(feed_url, "href"), 0)}
    end
  end

end
