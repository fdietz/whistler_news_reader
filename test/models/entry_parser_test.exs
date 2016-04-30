defmodule WhistlerNewsReader.EntryParserTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.EntryParser

  setup do
    user = create(:user)
    feed = create(:feed)
    category = create(:category, user: user)
    create(:subscription, feed: feed, user: user, category: category)

    {:ok, user: user, feed: feed}
  end

  test "store_entry succeeds", %{feed: feed} do
    json_body = File.read!("test/fixtures/rss2/example1.xml")
    {:ok, parsed_feed} = ElixirFeedParser.parse(json_body)
    entry_body = List.first(parsed_feed.entries)

    parsed_entry = EntryParser.parse(feed, entry_body)
    assert parsed_entry[:feed_id] == feed.id
    assert parsed_entry[:guid] == "426109B006893B33B516F302D8F8451D27E180A84CFA0AB9442AE1B44040724F"
    assert parsed_entry[:title] == "Example item title"
    assert parsed_entry[:url] == "http://www.example.com/items/1.html"
    assert parsed_entry[:summary] == "Example content with linkmy test paragraph is here."
    assert parsed_entry[:content] == "Example content with <a href=\"bla\">link</a><p>my test <em>paragraph</em> is here.</p>"
  end

end
