defmodule WhistlerNewsReader.Api.FeedControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription

  @feed_url "http://www.theverge.com/rss/frontpage"
  @other_feed_url "http://heise.de.feedsportal.com/c/35207/f/653902/index.rss"
  @not_existing_feed_url "http://www.theverge.com/404"

  @valid_attrs %{
    title: "The Verge",
    feed_url: "http://www.theverge.com/rss/frontpage",
    site_url: "http://www.theverge.com"
  }

  setup do
    user = Repo.insert!(%User{
      email: "test@test.de",
      first_name: "Donald",
      last_name: "Duck",
      encrypted_password: "password"
    })

    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    changeset = %Feed{} |> Feed.changeset(@valid_attrs)
    feed      = Repo.insert!(changeset)
    Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed}
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

  test "POST /api/feeds succeeds", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, feed_path(conn, :create), feed_url: @other_feed_url

    assert json_response(conn, 201)
    feed_id = json_response(conn, 201)["id"]
    assert Repo.get!(Feed, feed_id)
    assert Repo.get_by!(Subscription, feed_id: feed_id)
  end

  test "POST /api/feeds fails if feed exists already", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, feed_path(conn, :create), feed_url: @feed_url

    assert json_response(conn, 422)
    assert json_response(conn, 422)["errors"]
  end

  test "POST /api/feeds fails if feed url not found", %{conn: conn, jwt: jwt} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, feed_path(conn, :create), feed_url: @not_existing_feed_url

    assert json_response(conn, 404)
  end

  test "DELETE /api/feeds/:id succeeds", %{conn: conn, jwt: jwt, feed: feed} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = delete conn, feed_path(conn, :delete, feed.id)

    assert json_response(conn, 204)
    refute Repo.get_by(Subscription, feed_id: feed.id)
  end
end
