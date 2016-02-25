defmodule WhistlerNewsReader.ReadEntryTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.ReadEntry

  @valid_attrs %{entry_id: 42, feed_id: 42, user_id: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ReadEntry.changeset(%ReadEntry{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ReadEntry.changeset(%ReadEntry{}, @invalid_attrs)
    refute changeset.valid?
  end
end
