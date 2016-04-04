defmodule WhistlerNewsReader.FeedParser do
  def parse(json_body) do
    ElixirFeedParser.parse(json_body)
  end
end
