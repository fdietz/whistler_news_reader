defmodule WhistlerNewsReader.FeedRefresherTest do
  use WhistlerNewsReader.ModelCase, async: false

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.FeedRefresher
  alias WhistlerNewsReader.FeedFetcher

  import Mock

  @valid_feed_url "http://www.theverge.com/rss/full.xml"

  setup do
    user = create(:user)
    feed = create(:feed, title: "The Verge", feed_url: @valid_feed_url)
    category = create(:category, user: user)
    create(:subscription, feed: feed, user: user, category: category)

    {:ok, user: user, feed: feed}
  end

  test "refresh succeeds", %{user: user, feed: feed} do
    json_body = File.read!("test/fixtures/rss2/example1.xml")
    with_mock FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
      assert feed.last_refreshed_at == nil
      FeedRefresher.refresh(feed)
      
      subscribed_feed_ids = Feed |> Feed.subscribed_by_user(user.id) |> Repo.all |> Enum.map(fn(feed) -> feed.id end)
      entries = Entry |> Entry.for_feeds(subscribed_feed_ids) |> Repo.all
      assert length(entries) == 1
      assert List.last(entries).title == "Example item title"

      feed = Repo.get!(Feed, feed.id)
      assert feed.last_refreshed_at
    end
  end

end
