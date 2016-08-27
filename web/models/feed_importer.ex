defmodule WhistlerNewsReader.FeedImporter do

  alias WhistlerNewsReader.FeedFetcherWorker
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.StoreEntryHelper
  alias WhistlerNewsReader.FeedUrlExtractor

  require Logger

  def import(user, %{"feed_url" => feed_url} = feed_attributes, opts \\ []) do
    Logger.info "FeedImporter - import feed #{feed_url} for category #{feed_attributes["category_id"]}"
    {subscribe_user, _opts} = Keyword.pop(opts, :subscribe_user, false)

    with {:ok, parsed_attrs}   <- fetch_and_parse(feed_url),
         {:ok, feed}           <- find_or_create(parsed_attrs, feed_url) do

      if subscribe_user do
        with {:ok, _updated_feed}  <- update_last_refreshed_at(feed),
             {:ok, _subscription}  <- subscribe_user(user, feed, feed_attributes["category_id"]) do

          StoreEntryHelper.store_entries(feed, parsed_attrs.entries)
        end
      end
      {:ok, feed}
    end

  end

  def fetch_and_parse(feed_url) do
    case FeedFetcherWorker.fetch(feed_url) do
      {:ok, xml_body} ->
        case import_feed_url(xml_body) do
          {:error, _} ->
            import_site_url(xml_body)
          other ->
            other
        end
      {:error, 404} ->
        {:error, :feed_url_not_found}
      other ->
        other
    end
  end

  def import_site_url(xml_body) do
    with {:ok, feed_url}  <- FeedUrlExtractor.extract(xml_body),
         {:ok, xml_body}  <- FeedFetcherWorker.fetch(feed_url),
         do: import_feed_url(xml_body)
  end

  def import_feed_url(xml_body) do
    ElixirFeedParser.parse(xml_body)
  end

  defp update_last_refreshed_at(feed) do
    feed
    |> Feed.changeset(%{last_refreshed_at: Ecto.DateTime.utc})
    |> Repo.update
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
        site_url: feed_attrs.url,
        last_refreshed_at: Ecto.DateTime.utc
       })
    |> Repo.insert
  end

end
