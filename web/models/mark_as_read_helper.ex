defmodule WhistlerNewsReader.MarkAsReadHelper do

  alias WhistlerNewsReader.SubscribedEntry
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Repo

  def mark_entry_as_read(user, subscribed_entry) do
    unread_entry = Repo.get!(SubscribedEntry, subscribed_entry.id)
    unread_entry |> SubscribedEntry.changeset(%{read: true}) |> Repo.update!
  end

  def mark_all_subscriptions_as_read(user, subscriptions) do
    SubscribedEntry
    |> SubscribedEntry.for_subscription_ids(Enum.map(subscriptions, fn(s) -> s.id end))
    |> SubscribedEntry.for_user_id(user.id)
    |> Repo.update_all(set: [read: true])
  end

  def mark_as_unread_entry(entry) do
    Repo.transaction(fn ->
      subscriptions = Subscription
                     |> Subscription.for_feed_id(entry.feed_id)
                     |> Repo.all
      Enum.each(subscriptions, fn(s) ->
        %SubscribedEntry{}
        |> SubscribedEntry.changeset(%{entry_id: entry.id, subscription_id: s.id, feed_id: entry.feed_id, user_id: s.user_id, read: false})
        |> Repo.insert!
      end)
    end)
  end

end
