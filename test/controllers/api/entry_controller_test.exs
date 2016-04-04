
defmodule WhistlerNewsReader.Api.EntryControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.UnreadEntry
  alias WhistlerNewsReader.Subscription

  @valid_feed_attrs %{
    title: "The Verge 1",
    feed_url: "http://www.theverge.com/rss/all1",
    site_url: "http://www.theverge.com"
  }

  @valid_feed_attrs2 %{
    title: "The Verge 2",
    feed_url: "http://www.theverge.com/rss/all2",
    site_url: "http://www.theverge.com"
  }

  @valid_feed_attrs3 %{
    title: "The Verge 3",
    feed_url: "http://www.theverge.com/rss/all3",
    site_url: "http://www.theverge.com"
  }

  setup do
    user = create(:user)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    feed = %Feed{} |> Feed.changeset(@valid_feed_attrs) |> Repo.insert!
    feed2 = %Feed{} |> Feed.changeset(@valid_feed_attrs2) |> Repo.insert!
    feed3 = %Feed{} |> Feed.changeset(@valid_feed_attrs3) |> Repo.insert!

    category = create(:category, user: user)

    subscription = create(:subscription, feed: feed, user: user, category: category)
    subscription2 = create(:subscription, feed: feed2, user: user, category: category)
    # Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})
    # Repo.insert!(%Subscription{feed_id: feed2.id, user_id: user.id})

    # TODO: fix - 1 day arithmetic
    {{year, month, day}, _ } = :calendar.universal_time()
    entry = create(:entry, feed: feed, published: {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    entry2 = create(:entry, feed: feed2, published: {{year, month, day-1}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    entry3 = create(:entry, feed: feed3, published: {{year, month, day-2}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    # entry  = Repo.insert!(%Entry{feed_id: feed.id, title: "test1", published: {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl})
    # entry2 = Repo.insert!(%Entry{feed_id: feed2.id, title: "test2", published: {{year, month, day-1}, {0, 0, 0}} |> Ecto.DateTime.from_erl})
    # entry3 = Repo.insert!(%Entry{feed_id: feed3.id, title: "test3", published: {{year, month, day-2}, {0, 0, 0}} |> Ecto.DateTime.from_erl})


    unread_entry = create(:unread_entry, user: user, feed: feed, entry: entry)
    unread_entry2 = create(:unread_entry, user: user, feed: feed2, entry: entry2)
    unread_entry3 = create(:unread_entry, user: user, feed: feed3, entry: entry3)
    # Repo.insert!(%UnreadEntry{feed_id: feed.id, entry_id: entry.id, user_id: user.id})
    # Repo.insert!(%UnreadEntry{feed_id: feed2.id, entry_id: entry2.id, user_id: user.id})
    # Repo.insert!(%UnreadEntry{feed_id: feed3.id, entry_id: entry3.id, user_id: user.id})

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed, feed2: feed2, feed3: feed3, category: category, entry: entry, entry2: entry2, entry3: entry3, unread_entry: unread_entry, unread_entry2: unread_entry2, unread_entry3: unread_entry3}
  end

  test "GET /api/entries?feed_id=1 succeeds", %{conn: conn, jwt: jwt, feed: feed, entry: entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, entry_path(conn, :index, %{"feed_id" => feed.id})

    result = Enum.at(json_response(conn, 200)["entries"], 0)
    assert result["id"] == entry.id
    assert result["title"] == entry.title
  end

  test "GET /api/entries?feed_id=1 returns empty array if not subscribed to feed", %{conn: conn, jwt: jwt, feed3: feed3} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, entry_path(conn, :index, %{"feed_id" => feed3.id})

    assert json_response(conn, 200)["entries"] == []
  end

  test "GET /api/entries?category_id=1 succeeds", %{conn: conn, jwt: jwt, category: category, entry: entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, entry_path(conn, :index, %{"category_id" => category.id})

    result = Enum.at(json_response(conn, 200)["entries"], 0)
    assert result["id"] == entry.id
    assert result["title"] == entry.title
  end

  test "GET /api/entries?feed_id=all succeeds", %{conn: conn, jwt: jwt, entry: entry, entry2: entry2} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, entry_path(conn, :index, %{"feed_id" => "all"})

    first = Enum.at(json_response(conn, 200)["entries"], 0)
    second = Enum.at(json_response(conn, 200)["entries"], 1)

    assert first["id"] == entry.id
    assert first["title"] == entry.title
    assert second["id"] == entry2.id
    assert second["title"] == entry2.title
  end

  test "GET /api/entries?feed_id=today succeeds", %{conn: conn, jwt: jwt, entry: entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, entry_path(conn, :index, %{"feed_id" => "today"})

    assert 1 == length json_response(conn, 200)["entries"]
    first = Enum.at(json_response(conn, 200)["entries"], 0)
    assert first["id"] == entry.id
    assert first["title"] == entry.title
  end

  test "GET /api/entries fails if no token", %{conn: conn} do
    conn = get conn, entry_path(conn, :index, %{"feed_id" => 1})
    assert json_response(conn, 403)["error"] == "Not Authenticated"
  end

  test "PUT /api/entries/:id/mark_as_read succeeds", %{conn: conn, jwt: jwt, feed: feed, entry: entry, unread_entry: unread_entry} do
    assert unread_entry.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, entry_path(conn, :mark_as_read, entry)
    assert conn.status == 204

    assert Repo.get!(UnreadEntry, unread_entry.id).read == true
  end

  test "PUT /api/entries/mark_all_as_read succeeds for feed_id", %{conn: conn, jwt: jwt, feed: feed, unread_entry: unread_entry, unread_entry2: unread_entry2} do
    assert unread_entry.read == false
    assert unread_entry2.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, entry_path(conn, :mark_all_as_read, %{feed_id: feed.id})
    assert conn.status == 204

    assert Repo.get!(UnreadEntry, unread_entry.id).read == true
    assert Repo.get!(UnreadEntry, unread_entry2.id).read == false
  end

  test "PUT /api/entries/mark_all_as_read succeeds for category_id", %{conn: conn, jwt: jwt, feed: feed, category: category, unread_entry: unread_entry, unread_entry2: unread_entry2} do
    assert unread_entry.read == false
    assert unread_entry2.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, entry_path(conn, :mark_all_as_read, %{category_id: category.id})
    assert conn.status == 204

    assert Repo.get!(UnreadEntry, unread_entry.id).read == true
    assert Repo.get!(UnreadEntry, unread_entry2.id).read == true
  end

  test "PUT /api/entries/mark_all_as_read succeeds for feed_id all", %{conn: conn, jwt: jwt, feed: feed, unread_entry: unread_entry, unread_entry2: unread_entry2, unread_entry3: unread_entry3} do
    assert unread_entry.read == false
    assert unread_entry2.read == false
    assert unread_entry3.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, entry_path(conn, :mark_all_as_read, %{feed_id: "all"})
    assert conn.status == 204

    assert Repo.get!(UnreadEntry, unread_entry.id).read == true
    assert Repo.get!(UnreadEntry, unread_entry2.id).read == true
    assert Repo.get!(UnreadEntry, unread_entry3.id).read == false
  end

  test "PUT /api/entries/mark_all_as_read succeeds for feed_id today", %{conn: conn, jwt: jwt, feed: feed, unread_entry: unread_entry, unread_entry2: unread_entry2, unread_entry3: unread_entry3} do
    assert unread_entry.read == false
    assert unread_entry2.read == false
    assert unread_entry3.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, entry_path(conn, :mark_all_as_read, %{feed_id: "today"})
    assert conn.status == 204

    assert Repo.get!(UnreadEntry, unread_entry.id).read == true
    assert Repo.get!(UnreadEntry, unread_entry2.id).read == false
    assert Repo.get!(UnreadEntry, unread_entry3.id).read == false
  end
end
