defmodule WhistlerNewsReaderWeb.Api.SubscribedEntryControllerTest do
  use WhistlerNewsReaderWeb.ConnCase, async: false

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.SubscribedEntry

  @valid_feed_url "http://www.theverge.com/rss/full.xml"
  @valid_feed_url2 "http://feeds.wired.com/wired/index"
  @valid_feed_url3 "http://www.engadget.com/rss.xml"

  setup do
    user = insert(:user)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    feed = insert(:feed, title: "The Verge", feed_url: @valid_feed_url)
    feed2 = insert(:feed, title: "Wired", feed_url: @valid_feed_url2)
    feed3 = insert(:feed, title: "Engadget", feed_url: @valid_feed_url3)

    category = insert(:category, user: user)

    subscription = insert(:subscription, feed: feed, user: user, category: category)
    subscription2 = insert(:subscription, feed: feed2, user: user, category: category)
    subscription3 = insert(:subscription, feed: feed3, user: user, category: category)

    # TODO: fix - 1 day arithmetic
    {{year, month, day}, _} = :calendar.universal_time()
    entry = insert(:entry, feed: feed, published: { {year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    entry2 = insert(:entry, feed: feed2, published: {{year, month, day-1}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    entry3 = insert(:entry, feed: feed3, published: {{year, month, day-2}, {0, 0, 0}} |> Ecto.DateTime.from_erl)

    unread_entry = insert(:unread_entry, user: user, feed: feed, entry: entry, subscription: subscription)
    unread_entry2 = insert(:unread_entry, user: user, feed: feed2, entry: entry2, subscription: subscription2)
    unread_entry3 = insert(:unread_entry, user: user, feed: feed3, entry: entry3, subscription: subscription3)

    conn = build_conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, user: user, subscription: subscription, subscription2: subscription2, feed: feed, feed2: feed2, feed3: feed3, category: category, entry: entry, entry2: entry2, entry3: entry3, unread_entry: unread_entry, unread_entry2: unread_entry2, unread_entry3: unread_entry3}
  end

  test "GET /api/subscribed_entries?subscription_id=1 succeeds", %{conn: conn, jwt: jwt, subscription: subscription, entry: entry, unread_entry: unread_entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"subscription_id" => subscription.id})

    result = Enum.at(json_response(conn, 200)["entries"], 0)
    assert result["id"] == unread_entry.id
    assert result["title"] == entry.title
  end

  test "GET /api/subscribed_entries?subscription_id=1&last_published&limit succeeds", %{conn: conn, jwt: jwt, subscription: subscription, entry: entry, unread_entry: unread_entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"subscription_id" => subscription.id, "last_published" => Ecto.DateTime.to_iso8601(Ecto.DateTime.utc), "limit" => 1})

    result = Enum.at(json_response(conn, 200)["entries"], 0)
    assert result["id"] == unread_entry.id
    assert result["title"] == entry.title
  end

  test "GET /api/subscribed_entries?category_id=1 succeeds", %{conn: conn, jwt: jwt, category: category, entry: entry, unread_entry: unread_entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"category_id" => category.id, "last_published" => Ecto.DateTime.to_iso8601(Ecto.DateTime.utc), "limit" => 1})

    result = Enum.at(json_response(conn, 200)["entries"], 0)
    assert result["id"] == unread_entry.id
    assert result["title"] == entry.title
  end

  test "GET /api/subscribed_entries?category_id=1&last_published&limit succeeds", %{conn: conn, jwt: jwt, category: category, entry: entry, unread_entry: unread_entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"category_id" => category.id})

    result = Enum.at(json_response(conn, 200)["entries"], 0)
    assert result["id"] == unread_entry.id
    assert result["title"] == entry.title
  end

  test "GET /api/subscribed_entries?subscription_id=all succeeds", %{conn: conn, jwt: jwt, entry: entry, unread_entry: unread_entry, entry2: entry2, unread_entry2: unread_entry2} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"subscription_id" => "all"})
    first = Enum.at(json_response(conn, 200)["entries"], 0)
    second = Enum.at(json_response(conn, 200)["entries"], 1)

    assert first["id"] == unread_entry.id
    assert first["title"] == entry.title
    assert second["id"] == unread_entry2.id
    assert second["title"] == entry2.title
  end

  test "GET /api/subscribed_entries?subscription_id=all&last_published&limit succeeds", %{conn: conn, jwt: jwt, entry: entry, unread_entry: unread_entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"subscription_id" => "all", "last_published" => Ecto.DateTime.to_iso8601(Ecto.DateTime.utc), "limit" => 1})
    first = Enum.at(json_response(conn, 200)["entries"], 0)

    assert first["id"] == unread_entry.id
    assert first["title"] == entry.title
  end

  test "GET /api/subscribed_entries?subscription_id=today succeeds", %{conn: conn, jwt: jwt, entry: entry, unread_entry: unread_entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"subscription_id" => "today"})

    assert 1 == length json_response(conn, 200)["entries"]
    first = Enum.at(json_response(conn, 200)["entries"], 0)
    assert first["id"] == unread_entry.id
    assert first["title"] == entry.title
  end

  test "GET /api/subscribed_entries?subscription_id=today&last_published&limit succeeds", %{conn: conn, jwt: jwt, entry: entry, unread_entry: unread_entry} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscribed_entry_path(conn, :index, %{"subscription_id" => "today", "last_published" => Ecto.DateTime.to_iso8601(Ecto.DateTime.utc), "limit" => 1})

    assert 1 == length json_response(conn, 200)["entries"]
    first = Enum.at(json_response(conn, 200)["entries"], 0)
    assert first["id"] == unread_entry.id
    assert first["title"] == entry.title
  end

  test "GET /api/subscribed_entries fails if no token", %{conn: conn} do
    conn = get conn, subscribed_entry_path(conn, :index, %{"feed_id" => 1})
    assert json_response(conn, 403)["error"] == "Not Authenticated"
  end

  test "PUT /api/subscribed_entries/:id/mark_as_read succeeds", %{conn: conn, jwt: jwt, entry: entry, unread_entry: unread_entry} do
    assert unread_entry.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, subscribed_entry_path(conn, :mark_as_read, unread_entry)
    assert conn.status == 204

    assert Repo.get!(SubscribedEntry, unread_entry.id).read == true
  end

  test "PUT /api/subscribed_entries/mark_all_as_read succeeds for subscription_id", %{conn: conn, jwt: jwt, subscription: subscription, unread_entry: unread_entry, unread_entry2: unread_entry2} do
    assert unread_entry.read == false
    assert unread_entry2.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, subscribed_entry_path(conn, :mark_all_as_read, %{subscription_id: subscription.id})
    assert conn.status == 204

    assert Repo.get!(SubscribedEntry, unread_entry.id).read == true
    assert Repo.get!(SubscribedEntry, unread_entry2.id).read == false
  end

  test "PUT /api/subscribed_entries/mark_all_as_read succeeds for category_id", %{conn: conn, jwt: jwt, category: category, unread_entry: unread_entry, unread_entry2: unread_entry2} do
    assert unread_entry.read == false
    assert unread_entry2.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, subscribed_entry_path(conn, :mark_all_as_read, %{category_id: category.id})
    assert conn.status == 204

    assert Repo.get!(SubscribedEntry, unread_entry.id).read == true
    assert Repo.get!(SubscribedEntry, unread_entry2.id).read == true
  end

  test "PUT /api/subscribed_entries/mark_all_as_read succeeds for subscription_id all", %{conn: conn, jwt: jwt, unread_entry: unread_entry, unread_entry2: unread_entry2, unread_entry3: unread_entry3} do
    assert unread_entry.read == false
    assert unread_entry2.read == false
    assert unread_entry3.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, subscribed_entry_path(conn, :mark_all_as_read, %{subscription_id: "all"})
    assert conn.status == 204

    assert Repo.get!(SubscribedEntry, unread_entry.id).read == true
    assert Repo.get!(SubscribedEntry, unread_entry2.id).read == true
    assert Repo.get!(SubscribedEntry, unread_entry3.id).read == true
  end

  test "PUT /api/subscribed_entries/mark_all_as_read succeeds for subscription_id today", %{conn: conn, jwt: jwt, unread_entry: unread_entry, unread_entry2: unread_entry2, unread_entry3: unread_entry3} do
    assert unread_entry.read == false
    assert unread_entry2.read == false
    assert unread_entry3.read == false

    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, subscribed_entry_path(conn, :mark_all_as_read, %{subscription_id: "today"})
    assert conn.status == 204

    assert Repo.get!(SubscribedEntry, unread_entry.id).read == true
    assert Repo.get!(SubscribedEntry, unread_entry2.id).read == false
    assert Repo.get!(SubscribedEntry, unread_entry3.id).read == false
  end

end
