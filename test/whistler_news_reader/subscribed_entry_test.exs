defmodule WhistlerNewsReader.SubscribedEntryTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.SubscribedEntry

  @valid_attrs %{entry_id: 42, feed_id: 42, user_id: 42, subscription_id: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = SubscribedEntry.changeset(%SubscribedEntry{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = SubscribedEntry.changeset(%SubscribedEntry{}, @invalid_attrs)
    refute changeset.valid?
  end
end
