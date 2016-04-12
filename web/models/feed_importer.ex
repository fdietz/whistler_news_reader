defmodule WhistlerNewsReader.FeedImporter do

  alias WhistlerNewsReader.FeedFetcher
  alias WhistlerNewsReader.FeedParser
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Repo

  def import(user, %{"feed_url" => feed_url} = feed_attributes) do
    with {:ok, xml_body}      <- FeedFetcher.fetch(feed_url),
         {:ok, parsed_attrs}  <- FeedParser.parse(xml_body),
         {:ok, feed}          <- find_or_create(parsed_attrs, feed_url),
         {:ok, _subscription} <- subscribe_user(user, feed, feed_attributes["category_id"]),
         do: {:ok, feed}
  end

  defp subscribe_user(user, feed, category_id) do
    %Subscription{}
    |> Subscription.changeset(%{feed_id: feed.id, user_id: user.id, category_id: category_id})
    |> Repo.insert
  end

  defp find_or_create(feed_attrs, feed_url) do
    case store_feed(feed_attrs, feed_url) do
      {:ok, feed} -> {:ok, feed}
      {:error, changeset} ->
        if {:feed_url, "has already been taken"} in changeset.errors do
          {:ok, find_feed(feed_url)}
        else
          {:error, changeset}
        end
    end
  end

  defp find_feed(feed_url) do
    Feed |> Feed.for_feed_url(feed_url) |> Repo.one
  end

  defp store_feed(feed_attrs, feed_url) do
    %Feed{}
    |> Feed.changeset(%{
        title: feed_attrs.title,
        feed_url: feed_url,
        site_url: feed_attrs.url
       })
    |> Repo.insert
  end

end
