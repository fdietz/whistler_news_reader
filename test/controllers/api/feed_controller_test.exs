defmodule WhistlerNewsReader.Api.FeedControllerTest do
  use WhistlerNewsReader.ConnCase

  # import WhistlerNewsReader.Factory

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.UnreadEntry
  alias WhistlerNewsReader.Subscription

  @feed_url "http://www.theverge.com/rss/frontpage"
  @other_feed_url "http://heise.de.feedsportal.com/c/35207/f/653902/index.rss"
  @not_existing_feed_url "http://www.theverge.com/404"

  @valid_attrs %{
    title: "The Verge",
    feed_url: "http://www.theverge.com/rss/frontpage",
    site_url: "http://www.theverge.com"
  }

  @valid_attrs2 %{
    title: "The Verge 2",
    feed_url: "http://www.theverge.com/rss/all2",
    site_url: "http://www.theverge.com"
  }

  @valid_attrs3 %{
    title: "The Verge 3",
    feed_url: "http://www.theverge.com/rss/all3",
    site_url: "http://www.theverge.com"
  }

  setup do
    user = create(:user)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    feed = create(:feed)
    create(:subscription, user: user, feed: feed)
    # Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})

    # TODO: fix - 1 day arithmetic
    {{year, month, day}, _ } = :calendar.universal_time()
    entry = create(:entry, feed: feed, published: {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    entry2 = create(:entry, feed: feed, published: {{year, month, day-1}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    # entry  = Repo.insert!(%Entry{feed_id: feed.id, title: "test1", published: {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl})
    # entry2 = Repo.insert!(%Entry{feed_id: feed.id, title: "test2", published: {{year, month, day-1}, {0, 0, 0}} |> Ecto.DateTime.from_erl})

    create(:unread_entry, user: user, feed: feed, entry: entry)
    create(:unread_entry, user: user, feed: feed, entry: entry2)
    # Repo.insert!(%UnreadEntry{feed_id: feed.id, entry_id: entry.id, user_id: user.id})
    # Repo.insert!(%UnreadEntry{feed_id: feed.id, entry_id: entry2.id, user_id: user.id})

    category = create(:category, user: user)

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed, entry: entry, entry2: entry2, category: category}
  end

  test "GET /api/feeds succeeds", %{conn: conn, jwt: jwt, feed: feed} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, feed_path(conn, :index)

    result = List.first(json_response(conn, 200)["feeds"])
    assert result["id"] == feed.id
    assert result["title"] == feed.title
  end

  test "GET /api/feeds fails if no token", %{conn: conn} do
    conn = get conn, feed_path(conn, :index)
    assert json_response(conn, 403)["error"] == "Not Authenticated"
  end

  test "GET /api/feeds/:id succeeds", %{conn: conn, jwt: jwt, feed: feed} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, feed_path(conn, :show, feed)

    result = json_response(conn, 200)["feed"]
    assert result["id"] == feed.id
    assert result["title"] == feed.title
  end

  test "POST /api/feeds succeeds", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, feed_path(conn, :create), feed: %{feed_url: @other_feed_url}

    assert json_response(conn, 201)
    feed_id = json_response(conn, 201)["feed"]["id"]
    assert Repo.get!(Feed, feed_id)
    assert Repo.get_by!(Subscription, feed_id: feed_id)
  end

  test "POST /api/feeds succeeds", %{conn: conn, jwt: jwt, category: category} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, feed_path(conn, :create), feed: %{feed_url: @other_feed_url, category_id: category.id}

    assert json_response(conn, 201)
    feed_id = json_response(conn, 201)["feed"]["id"]
    category_id = json_response(conn, 201)["feed"]["category_id"]
    assert category_id == category.id
    assert Repo.get!(Feed, feed_id)
    assert Repo.get_by!(Subscription, feed_id: feed_id)
  end

  test "POST /api/feeds fails if feed exists already", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, feed_path(conn, :create), feed: %{feed_url: @feed_url}

    assert json_response(conn, 422)
    assert json_response(conn, 422)["errors"]
  end

  test "POST /api/feeds fails if feed url not found", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, feed_path(conn, :create), feed: %{feed_url: @not_existing_feed_url}

    assert conn.status == 404
  end

  test "DELETE /api/feeds/:id succeeds", %{conn: conn, jwt: jwt, feed: feed} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = delete conn, feed_path(conn, :delete, feed.id)
    assert conn.status == 204
    refute Repo.get_by(Subscription, feed_id: feed.id)
  end

  # test "PUT /api/feeds/:id/mark_as_read succeeds", %{conn: conn, jwt: jwt, feed: feed, entry: entry, entry2: entry2} do
  #   assert Repo.get_by(UnreadEntry, feed_id: feed.id, entry_id: entry.id)
  #   assert Repo.get_by(UnreadEntry, feed_id: feed.id, entry_id: entry2.id)
  #
  #   conn = conn |> put_req_header("authorization", jwt)
  #   conn = put conn, feed_path(conn, :mark_as_read, feed)
  #   assert conn.status == 204
  #
  #   refute Repo.get_by(UnreadEntry, feed_id: feed.id, entry_id: entry.id)
  #   refute Repo.get_by(UnreadEntry, feed_id: feed.id, entry_id: entry2.id)
  # end
end
