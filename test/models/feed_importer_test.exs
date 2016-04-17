defmodule WhistlerNewsReader.FeedImporterTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.FeedImporter
  alias WhistlerNewsReader.FeedFetcher

  import Mock

  @feed_url "http://www.theverge.com/rss/frontpage"
  @not_existing_feed_url "http://www.theverge.com/404"
  @invalid_feed_format_feed_url "http://www.theverge.com/invalid_feed_format"

  @valid_attrs %{
    title: "The Verge - All Posts",
    feed_url: "http://www.theverge.com/rss/frontpage",
    site_url: "http://www.theverge.com"
  }

  @invalid_attrs %{}

  setup do
    user = create(:user)
    {:ok, user: user}
  end

  test "fetch_and_parse fails on HTTP not found error", %{user: user} do
    with_mock FeedFetcher, [fetch: fn(_feed_url) -> {:error, :not_found} end] do
      assert FeedImporter.import(user, %{"feed_url" => @feed_url}) == {:error, :not_found}
    end
  end

  test "import_feed succeeds for feed file", %{user: user} do
    json_body = File.read!("test/fixtures/rss2/example1.xml")
    with_mock FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
      {:ok, feed } = FeedImporter.import(user, %{"feed_url" => @feed_url})
      assert Repo.get_by!(Subscription, feed_id: feed.id)
      assert "http://www.example.com" == feed.site_url
    end
  end

  # TODO: how to mock second FeedFetcher.fetch call?
  # test "import_feed succeeds for website containing reference to feed", %{user: user} do
  #   json_body = File.read!("test/fixtures/html/example1.html")
  #   with_mock FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
  #     {:ok, feed } = FeedImporter.import(user, %{"feed_url" => @feed_url})
  #     assert Repo.get_by!(Subscription, feed_id: feed.id)
  #     assert "http://www.example.com" == feed.site_url
  #   end
  # end
end
