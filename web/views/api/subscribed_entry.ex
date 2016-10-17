defmodule WhistlerNewsReader.Api.SubscribedEntryView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{subscribed_entries: subscribed_entries}) do
    %{entries: render_many(subscribed_entries, WhistlerNewsReader.Api.SubscribedEntryView, "subscribed_entry.json")}
  end

  def render("show.json", %{subscribed_entry: subscribed_entry}) do
    %{entry: render_one(subscribed_entry, WhistlerNewsReader.Api.SubscribedEntryView, "subscribed_entry.json")}
  end

  def render("subscribed_entry.json", %{subscribed_entry: subscribed_entry}) do
    Map.merge(%{
      id: subscribed_entry.id,
      unread: !subscribed_entry.read,
      feed_id: subscribed_entry.feed_id,
      subscription_id: subscribed_entry.subscription_id,
      category_id: subscribed_entry.subscription.category_id,
      image_url: "/api/subscribed_entries/#{subscribed_entry.id}/image/200x200"
    }, render_entry(subscribed_entry.entry))
  end

  defp render_entry(entry) do
    %{
      title: entry.title,
      published: entry.published,
      author: entry.author,
      summary: entry.summary,
      content: entry.content,
      url: entry.url,
      guid: entry.guid
    }
  end
end
