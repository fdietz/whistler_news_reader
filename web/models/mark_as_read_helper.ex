defmodule WhistlerNewsReader.MarkAsReadHelper do

  alias WhistlerNewsReader.UnreadEntry
  alias WhistlerNewsReader.Subscription
  alias WhistlerNewsReader.Repo

  def mark_entry_as_read(user, entry) do
    unread_entry = Repo.get_by!(UnreadEntry, feed_id: entry.feed_id, entry_id: entry.id, user_id: user.id)
    unread_entry |> UnreadEntry.changeset(%{read: true}) |> Repo.update!
  end

  def mark_feed_as_read(user, feed) do
    UnreadEntry
    |> UnreadEntry.for_feed(feed.id)
    |> UnreadEntry.for_user(user.id)
    |> Repo.update_all(set: [read: true])
  end

  def mark_all_feeds_as_read(user, feeds) do
    Repo.transaction(fn ->
      Enum.each(feeds, fn(feed) ->
        mark_feed_as_read(user, feed)
      end)
    end)
  end

  def mark_as_unread_entry(entry) do
    Repo.transaction(fn ->
      subscriptions = Subscription
                     |> Subscription.for_feed(entry.feed_id)
                     |> Repo.all
      Enum.each(subscriptions, fn(s) ->
        %UnreadEntry{}
        |> UnreadEntry.changeset(%{entry_id: entry.id, feed_id: entry.feed_id, user_id: s.user_id, read: false})
        |> Repo.insert!
      end)
    end)
  end

end
