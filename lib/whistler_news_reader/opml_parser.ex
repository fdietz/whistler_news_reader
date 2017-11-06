defmodule WhistlerNewsReader.OpmlParser do

  def parse(xml_body) do
    Floki.find(xml_body, "outline")
    |> Enum.map(&parse_category(&1))
    |> Enum.reject(fn(o) -> o == {} end)
  end

  defp parse_category({"outline", [{"text", text}, {"title", title}], children}) do
    %{
      text: text,
      title: title,
      feeds: children |> Floki.find("outline") |> Enum.map(&parse_feed(&1))
    }
  end

  defp parse_category(_), do: {}

  defp parse_feed(entry) do
    %{
      text: Floki.attribute(entry, "text") |> List.first,
      title: Floki.attribute(entry, "title") |> List.first,
      xmlurl: Floki.attribute(entry, "xmlurl") |> List.first,
      htmlurl: Floki.attribute(entry, "htmlurl") |> List.first,
      type: Floki.attribute(entry, "type") |> List.first
    }
  end

end
