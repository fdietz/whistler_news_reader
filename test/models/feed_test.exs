defmodule WhistlerNewsReader.FeedTest do
  use WhistlerNewsReader.ModelCase

  alias WhistlerNewsReader.Feed

  @valid_attrs %{
    title: "The Verge",
    feed_url: "http://www.theverge.com/rss/frontpage",
    site_url: "http://www.theverge.com"
  }

  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Feed.changeset(%Feed{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Feed.changeset(%Feed{}, @invalid_attrs)
    refute changeset.valid?
  end

  test "fails if feed exists already for feed_url" do
    %Feed{}
    |> Feed.changeset(@valid_attrs)
    |> Repo.insert!

    feed = %Feed{}
    |> Feed.changeset(@valid_attrs)

    assert {:error, changeset} = Repo.insert(feed)
    assert changeset.errors[:feed_url] == {"has already been taken", []}
  end
end
