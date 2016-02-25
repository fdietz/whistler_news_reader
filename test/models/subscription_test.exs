defmodule WhistlerNewsReader.SubscriptionTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.Subscription

  @valid_attrs %{feed_id: 42, user_id: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Subscription.changeset(%Subscription{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Subscription.changeset(%Subscription{}, @invalid_attrs)
    refute changeset.valid?
  end
end
