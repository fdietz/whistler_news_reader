defmodule WhistlerNewsReader.FeedImporterTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.FeedImporter
  alias WhistlerNewsReader.User

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
    user = Repo.insert!(%User{
      email: "test@test.de",
      first_name: "Donald",
      last_name: "Duck",
      encrypted_password: "password"
    })

    {:ok, user: user}
  end

  test "fetch_and_parse succeeds" do
    {:ok, feed_attrs } = FeedImporter.fetch_and_parse(@feed_url)
    assert "http://www.theverge.com/rss/full.xml" == feed_attrs[:id]
  end

  test "fetch_and_parse fails on HTTP not found error" do
    {:error, :not_found } = FeedImporter.fetch_and_parse(@not_existing_feed_url)
  end

  test "fetch_and_parse fails on parsing invalid feed" do
    {:error, error } = FeedImporter.fetch_and_parse(@invalid_feed_format_feed_url)
    assert :not_found == error
  end

  test "import_feed succeeds", %{user: user} do
    {:ok, feed } = FeedImporter.import_feed(user, @feed_url)
    assert Repo.get_by!(Subscription, feed_id: feed.id)
    assert "http://www.theverge.com/" == feed.site_url
    assert "http://www.theverge.com/rss/frontpage" == feed.feed_url
  end
end
