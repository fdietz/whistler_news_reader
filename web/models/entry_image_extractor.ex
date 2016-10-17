defmodule WhistlerNewsReader.EntryImageExtractor do
  @moduledoc """
  Extract image from feed entry
  """

  # TODO: only use img if found at the beginning
  def extract_url(subscribed_entry) do
    content = subscribed_entry.entry.content || ""
    result = Regex.run(~r/<img.*?src="(.*?)"/, content)
    first_match(result)
  end

  defp first_match(nil), do: {:error}
  defp first_match([]), do: {:error}
  defp first_match(list) when length(list) > 1 do
    {:ok, Enum.at(list, 1)}
  end
end
