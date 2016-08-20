defmodule WhistlerNewsReader.FeedServerTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.FeedFetcher
  alias WhistlerNewsReader.FeedServer

  import Mock

  @feed_url "http://www.theverge.com/rss/frontpage"
  @valid_feed_url "http://www.theverge.com/rss/full.xml"

  setup do
    user = insert(:user)
    feed = insert(:feed, title: "The Verge", feed_url: @valid_feed_url)
    category = insert(:category, user: user)
    insert(:subscription, feed: feed, user: user, category: category)

    json_body = File.read!("test/fixtures/rss2/example1.xml")

    {:ok, user: user, feed: feed, json_body: json_body}
  end

  test "refresh succeeds", %{user: user, feed: feed, json_body: json_body} do
    with_mock FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
      assert feed.last_refreshed_at == nil
      FeedServer.refresh(feed)

      subscribed_feed_ids = Feed |> Feed.subscribed_by_user(user.id) |> Repo.all |> Enum.map(fn(feed) -> feed.id end)
      entries = Entry |> Entry.for_feeds(subscribed_feed_ids) |> Repo.all
      assert length(entries) == 1
      assert List.last(entries).title == "Example item title"

      feed = Repo.get!(Feed, feed.id)
      assert feed.last_refreshed_at
    end
  end

  test "import_feed succeeds for feed file", %{user: user, json_body: json_body} do
    with_mock FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
      {:ok, feed} = FeedServer.import(user, %{"feed_url" => @feed_url})
      assert "http://www.example.com" == feed.site_url
    end
  end
end
