defmodule WhistlerNewsReader.RandomImageFetcher do
  @url "https://unsplash.com/"

  def fetch do
    {:ok, html} = fetch_html
    images = Floki.find(html, ".photo img")
    Enum.map(images, fn(img) ->
      %{
        alt: Enum.at(Floki.attribute(img, "alt"), 0),
        url: normalize_url(Enum.at(Floki.attribute(img, "src"), 0))
      }
    end)
  end

  defp fetch_html do
    case HTTPoison.get(@url) do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        {:ok, body}
      other ->
        other
    end
  end

  defp normalize_url(url) do
    Enum.at(String.split(url, "?"), 0)
  end
end
