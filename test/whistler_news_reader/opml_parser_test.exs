defmodule WhistlerNewsReader.OpmlParserTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.OpmlParser

  test "parses opml file" do
    xml_body = File.read!("test/fixtures/opml/example1.opml")
    result = OpmlParser.parse(xml_body)

    category = List.first(result)
    assert category[:title] == "frontend-webapps"

    feed = List.first(category[:feeds])
    assert feed[:title] == "AddyOsmani.com | Articles for developers"
    assert feed[:xmlurl] == "http://addyosmani.com/blog/feed/"
  end

end
