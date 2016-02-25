defmodule WhistlerNewsReader.UserTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.User

  @valid_attrs %{
    email: "test@test.de",
    password: "some content",
    first_name: "some content",
    last_name: "some content"
  }
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = User.changeset(%User{}, @invalid_attrs)
    refute changeset.valid?
  end
end
