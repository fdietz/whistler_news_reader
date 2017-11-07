defmodule WhistlerNewsReader.UserTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.User

  @valid_attrs %{
    email: "test@test.de",
    password: "some content",
    name: "some content"
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

  test "encrypted_password value gets set to a hash" do
    changeset = User.changeset(%User{}, @valid_attrs)
    assert Comeonin.Bcrypt.checkpw(@valid_attrs.password, Ecto.Changeset.get_change(changeset, :encrypted_password))
  end
end
