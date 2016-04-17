defmodule WhistlerNewsReader.FeedUrlExtractorTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.FeedUrlExtractor

  test "extract feed url" do
    json_body = File.read!("test/fixtures/html/example1.html")
    {:ok, feed_url} = FeedUrlExtractor.extract(json_body)
    assert feed_url == "http://example.com/rss2.xml"
  end
end
