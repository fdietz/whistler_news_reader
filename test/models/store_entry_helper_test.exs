defmodule WhistlerNewsReader.StoreEntryHelperTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.FeedParser
  alias WhistlerNewsReader.StoreEntryHelper

  setup do
    user = create(:user)
    feed = create(:feed)
    category = create(:category, user: user)
    create(:subscription, feed: feed, user: user, category: category)

    {:ok, user: user, feed: feed}
  end

  test "store_entry succeeds", %{feed: feed} do
    json_body = File.read!("test/fixtures/rss2/example1.xml")
    {:ok, parsed_feed} = FeedParser.parse(json_body)
    parsed_entry = List.first(parsed_feed.entries)
    StoreEntryHelper.store_entry(feed, parsed_entry)

    entry = Repo.get_by!(Entry, feed_id: feed.id)
    assert entry.title, "Example item title"
    assert entry.url, "http://www.example.com/items/1.html"
  end

end
