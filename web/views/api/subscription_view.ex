defmodule WhistlerNewsReader.Api.SubscriptionView do
  use WhistlerNewsReader.Web, :view

  def render("show.json", %{subscription: subscription}) do
    %{subscription: render_one(subscription, WhistlerNewsReader.Api.SubscriptionView, "subscription.json")}
  end

  def render("subscription.json", %{subscription: subscription}) do
    %{
      id: subscription.id,
      feed_id: subscription.feed_id
     }
  end
end
