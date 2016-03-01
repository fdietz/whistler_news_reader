defmodule WhistlerNewsReader.UnreadEntryTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.UnreadEntry

  @valid_attrs %{entry_id: 42, feed_id: 42, user_id: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = UnreadEntry.changeset(%UnreadEntry{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = UnreadEntry.changeset(%UnreadEntry{}, @invalid_attrs)
    refute changeset.valid?
  end
end
