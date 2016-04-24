defmodule WhistlerNewsReader.Api.SubscriptionView do
  use WhistlerNewsReader.Web, :view

  # TODO: is there a more elegant way to do this using render_many?
  def render("index.json", %{subscriptions: subscriptions, unread_entries_count: unread_entries_count}) do
    %{
      subscriptions: Enum.map(subscriptions, fn(subscription) ->
        result = render("subscription.json", subscription: subscription)
        Map.put(result, :unread_count, unread_entries_count_for(subscription, unread_entries_count))
      end)
    }
  end

  # TODO: is there a more elegant way to do this using render_one?
  def render("show.json", %{subscription: subscription, unread_entries_count: unread_entries_count}) do
    # result = %{subscription: render_one(subscription, WhistlerNewsReader.Api.FeedView, "subscription.json")}
    result = render("subscription.json", subscription: subscription)
    result = Map.put(result, :unread_count, unread_entries_count_for(subscription, unread_entries_count))
    %{
      subscription:  result
    }
  end

  def render("subscription.json", %{subscription: subscription}) do
    %{
      id: subscription.id,
      title: subscription.title || subscription.feed.title,
      feed_url: subscription.feed.feed_url,
      site_url: subscription.feed.site_url,
      last_refreshed_at: subscription.feed.last_refreshed_at,
      category_id: subscription.category_id
     }
  end

  defp unread_entries_count_for(subscription, unread_entries_count) do
    arr = Enum.find(unread_entries_count, fn(arr) -> subscription.id == List.first(arr) end)

    case arr do
      [_subscription_id, count] ->
        count
      nil -> 0
    end
  end
end
