defmodule WhistlerNewsReader.FeedImporter do

  alias WhistlerNewsReader.FeedFetcher
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Repo

  def import_feed(feed_url) do
    fetch_and_parse(feed_url)
    # case fetch_and_parse(feed_url) do
    #   {:ok, feed_attrs} ->
    #     # store_feed_and_subscribe_user_in_transaction(user, feed_attrs, feed_url)
    #     feed = store_feed(feed_attrs, feed_url)
    #     {:ok, feed}
    #   {:error, :not_found} ->
    #     {:error, :not_found}
    # end
  end

  def fetch_and_parse(feed_url) do
    case FeedFetcher.fetch(feed_url) do
      {:ok, body} ->
        {:ok, ElixirFeedParser.parse(body)}
      {:error, reason} ->
        {:error, reason}
    end
  end

  # returns {:ok, feed} on success
  # def store_feed_and_subscribe_user_in_transaction(user, feed_attrs, feed_url) do
  #   try do
  #     feed = Repo.transaction(fn ->
  #       feed = store_feed(feed_attrs, feed_url)
  #       subscribe_user(user, feed)
  #       feed
  #     end)
  #     feed
  #   rescue
  #     e in Ecto.InvalidChangesetError ->
  #       {:error, e.changeset}
  #   end
  # end

  # def subscribe_user(user, feed) do
  #   Repo.insert!(Ecto.build_assoc(
  #     feed,
  #     :subscriptions,
  #     user_id: user.id
  #   ))
  # end

  def store_feed(feed_attrs, feed_url) do
    %Feed{} |> Feed.changeset(%{
      title: feed_attrs.title,
      feed_url: feed_url,
      site_url: feed_attrs.url
    }) |> Repo.insert!
  end

end
