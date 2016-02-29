defmodule WhistlerNewsReader.FetcherTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Fetcher
  alias WhistlerNewsReader.Entry

  @feed_url "http://www.theverge.com/rss/frontpage"
  @not_existing_feed_url "http://www.theverge.com/404"
  @invalid_feed_format_feed_url "http://www.theverge.com/invalid_feed_format"

  @valid_attrs %{
    title: "The Verge - All Posts",
    feed_url: "http://www.theverge.com/rss/frontpage",
    site_url: "http://www.theverge.com"
  }

  @invalid_attrs %{}

  test "import succeeds" do
    {:ok, feed_attrs } = Fetcher.import_feed(@feed_url)
    assert "http://www.theverge.com/rss/full.xml" == feed_attrs[:id]
  end

  test "import fails on HTTP not found error" do
    {:error, :not_found } = Fetcher.import_feed(@not_existing_feed_url)
  end

  test "import fails on parsing invalid feed" do
    {:error, error } = Fetcher.import_feed(@invalid_feed_format_feed_url)
    IO.puts "invalid feed"
    IO.inspect error
    assert :not_found == error
  end
end
