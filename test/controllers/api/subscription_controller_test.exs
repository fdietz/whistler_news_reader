defmodule WhistlerNewsReader.Api.SubscriptionControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription

  @valid_feed_attrs %{
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

    changeset = %Feed{} |> Feed.changeset(@valid_feed_attrs)
    feed      = Repo.insert!(changeset)

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed, user: user}
  end

  test "CREATE /api/subscriptions succeeds", %{conn: conn, jwt: jwt, feed: feed, user: user} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, subscription_path(conn, :create), feed_id: feed.id

    assert json_response(conn, 201)
    assert json_response(conn, 201)["id"]
    assert Repo.get_by(Subscription, feed_id: feed.id, user_id: user.id)
  end

  test "CREATE /api/subscriptions fails if exist already", %{conn: conn, jwt: jwt, feed: feed, user: user} do
    Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})

    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, subscription_path(conn, :create), feed_id: feed.id

    assert json_response(conn, 422)
  end

  test "CREATE /api/subscriptions fails if token missing", %{conn: conn, feed: feed} do
    conn = post conn, subscription_path(conn, :create), feed_id: feed.id
    assert json_response(conn, 403)["error"] == "Not Authenticated"
  end

end
