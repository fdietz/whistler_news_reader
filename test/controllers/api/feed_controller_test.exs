defmodule WhistlerNewsReader.Api.FeedControllerTest do
  use WhistlerNewsReader.ConnCase, async: false

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Feed

  import Mock

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
    user = insert(:user)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    feed = insert(:feed)
    subscription = insert(:subscription, user: user, feed: feed)

    # TODO: fix - 1 day arithmetic
    {{year, month, day}, _ } = :calendar.universal_time()
    entry = insert(:entry, feed: feed, published: {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl)
    entry2 = insert(:entry, feed: feed, published: {{year, month, day-1}, {0, 0, 0}} |> Ecto.DateTime.from_erl)

    insert(:unread_entry, user: user, feed: feed, entry: entry, subscription: subscription)
    insert(:unread_entry, user: user, feed: feed, entry: entry2, subscription: subscription)

    category = insert(:category, user: user)

    conn = build_conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed, entry: entry, entry2: entry2, category: category, subscription: subscription}
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
    json_body = File.read!("test/fixtures/rss2/example1.xml")
    with_mock WhistlerNewsReader.FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
      conn = conn |> put_req_header("authorization", jwt)
      conn = post conn, feed_path(conn, :create), feed: %{feed_url: @other_feed_url}

      assert json_response(conn, 201)
      feed_id = json_response(conn, 201)["feed"]["id"]
      assert Repo.get!(Feed, feed_id)
    end
  end

  # test "POST /api/feeds succeeds with category", %{conn: conn, jwt: jwt, category: category} do
  #   json_body = File.read!("test/fixtures/rss2/example1.xml")
  #   with_mock WhistlerNewsReader.FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
  #     conn = conn |> put_req_header("authorization", jwt)
  #     conn = post conn, feed_path(conn, :create), feed: %{feed_url: @other_feed_url, category_id: category.id}
  #
  #     assert json_response(conn, 201)
  #     feed_id = json_response(conn, 201)["feed"]["id"]
  #     category_id = json_response(conn, 201)["feed"]["category_id"]
  #     assert category_id == category.id
  #     assert Repo.get!(Feed, feed_id)
  #   end
  # end

  test "POST /api/feeds fails if feed exists already", %{conn: conn, jwt: jwt} do
    json_body = File.read!("test/fixtures/rss2/example1.xml")
    with_mock WhistlerNewsReader.FeedFetcher, [fetch: fn(_feed_url) -> {:ok, json_body} end] do
      conn = conn |> put_req_header("authorization", jwt)
      conn = post conn, feed_path(conn, :create), feed: %{feed_url: @feed_url}

      assert json_response(conn, 422)
      assert json_response(conn, 422)["errors"] == [%{"feed_url" => "has already been taken"}]
    end
  end

  test "PUT /api/feeds succeeds", %{conn: conn, jwt: jwt, feed: feed} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, feed_path(conn, :update, feed.id), feed: %{title: "new name"}

    assert conn.status == 204
    assert Repo.get!(Feed, feed.id).title == "new name"
  end

  test "DELETE /api/feeds/:id succeeds", %{conn: conn, jwt: jwt, feed: feed} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = delete conn, feed_path(conn, :delete, feed.id)
    assert conn.status == 204
    refute Repo.get(Feed, feed.id)
  end

end
