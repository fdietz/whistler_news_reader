defmodule WhistlerNewsReader.FeedImporter do

  alias WhistlerNewsReader.FeedFetcher
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Repo

  def import_feed(user, %{"feed_url" => feed_url} = feed_attributes) do
    case fetch_and_parse(feed_url) do
      {:ok, parsed_attrs} ->
        store_feed_and_subscribe_user_in_transaction(user, parsed_attrs, feed_url, feed_attributes["category_id"])
      {:error, :nxdomain} ->
        {:error, :not_found}
      {:error, :not_found} ->
        {:error, :not_found}
    end
  end

  def fetch_and_parse(feed_url) do
    case FeedFetcher.fetch(feed_url) do
      {:ok, body} ->
        {:ok, ElixirFeedParser.parse(body)}
      {:error, reason} ->
        {:error, reason}
    end
  end

  def store_feed_and_subscribe_user_in_transaction(user, parsed_attrs, feed_url, category_id) do
    {:ok, feed} = find_or_create(parsed_attrs, feed_url)
    case subscribe_user(user, feed, category_id) do
      {:ok, _} ->
        {:ok, feed}
      {:error, changeset } ->
        {:error, changeset}
    end
  end

  def subscribe_user(user, feed, category_id) do
    changeset = Subscription.changeset(%Subscription{}, %{feed_id: feed.id, user_id: user.id, category_id: category_id})
    Repo.insert(changeset)
  end

  def find_or_create(feed_attrs, feed_url) do
    case store_feed(feed_attrs, feed_url) do
      {:ok, feed} -> {:ok, feed}
      {:error, changeset} ->
        if {:feed_url, "has already been taken"} in changeset.errors do
          feed = Feed
          |> Feed.for_feed_url(feed_url)
          |> Repo.all
          |> List.first
          {:ok, feed}
        else
          {:error, changeset}
        end
    end
  end

  def store_feed(feed_attrs, feed_url) do
    %Feed{}
    |> Feed.changeset(%{
        title: feed_attrs.title,
        feed_url: feed_url,
        site_url: feed_attrs.url
       })
    |> Repo.insert
  end

end
