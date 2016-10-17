defmodule WhistlerNewsReader.EntryParserTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.EntryParser

  setup do
    user = insert(:user)
    feed = insert(:feed)
    category = insert(:category, user: user)
    insert(:subscription, feed: feed, user: user, category: category)

    {:ok, user: user, feed: feed}
  end

  test "store_entry succeeds for rss2", %{feed: feed} do
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

  test "store_entry succeeds for atom", %{feed: feed} do
    json_body = File.read!("test/fixtures/atom/example1.xml")
    {:ok, parsed_feed} = ElixirFeedParser.parse(json_body)
    entry_body = List.first(parsed_feed.entries)

    parsed_entry = EntryParser.parse(feed, entry_body)
    assert parsed_entry[:feed_id] == feed.id
    assert parsed_entry[:guid] == "1D69ED1DF649131628990F74515EFBD0F59ED08112B66B22507DA9D11EB5BA1E"
    assert parsed_entry[:title] == "Politiker-Fakes: Virtuelle Doppelgänger ärgern die Mächtigen"
    assert parsed_entry[:url] == "https://www.heise.de/newsticker/meldung/Politiker-Fakes-Virtuelle-Doppelgaenger-aergern-die-Maechtigen-3351148.html?wt_mc=rss.ho.beitrag.atom"
    assert parsed_entry[:summary] == "Früher wurden Politiker im Kabarett veräppelt, heute geschieht das im Netz: Fake-Profile für Trump oder Merkel setzen sich satirisch mit politischer Inszenierung auseinander – und legen manchmal selbst die Originale rein."
    assert Regex.match?(~r/Virtuelle/, parsed_entry[:content])
  end
end
