defmodule WhistlerNewsReader.FeedUrlExtractorTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.FeedUrlExtractor

  test "extract rss feed url" do
    json_body = File.read!("test/fixtures/html/example1.html")
    {:ok, feed_url} = FeedUrlExtractor.extract(json_body)
    assert feed_url == "http://example.com/rss2.xml"
  end

  test "extract atom feed url" do
    json_body = File.read!("test/fixtures/html/example2.html")
    {:ok, feed_url} = FeedUrlExtractor.extract(json_body)
    assert feed_url == "http://example.com/atom.xml"
  end
end
