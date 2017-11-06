defmodule WhistlerNewsReader.FeedUrlExtractor do

  # extract the following
  # <link rel="alternate" type="application/rss+xml" href="http://example.com"/>
  # <link rel="alternate" type="application/atom+xml" href="http://example.com"/>
  def extract(html) do
    rss_match = Floki.find(html, "link[type='application/rss+xml']")
    atom_match = Floki.find(html, "link[type='application/atom+xml']")

    case href(rss_match) || href(atom_match) do
      nil ->
        {:error, :feed_url_not_found}
      match ->
        {:ok, match}
    end
  end

  defp href(element) do
    Enum.at(Floki.attribute(element, "href"), 0)
  end
end
