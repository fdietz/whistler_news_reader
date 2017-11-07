defmodule WhistlerNewsReaderWeb.Api.SubscriptionControllerTest do
  use WhistlerNewsReaderWeb.ConnCase, async: false

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Subscription

  setup do
    user = insert(:user)
    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    feed = insert(:feed)
    category = insert(:category, user: user)

    conn = build_conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed, category: category, user: user}
  end

  test "CREATE /api/subscriptions succeeds", %{conn: conn, jwt: jwt, feed: feed, user: user} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, subscription_path(conn, :create), subscription: %{feed_id: feed.id}

    assert json_response(conn, 201)
    assert json_response(conn, 201)["subscription"]["id"]
    assert Repo.get_by(Subscription, feed_id: feed.id, user_id: user.id)
  end

  test "CREATE /api/subscriptions fails if exist already", %{conn: conn, jwt: jwt, feed: feed, user: user} do
    Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})

    conn = conn |> put_req_header("authorization", jwt)
    conn = post conn, subscription_path(conn, :create), subscription: %{feed_id: feed.id}

    assert json_response(conn, 422)
  end

  test "CREATE /api/subscriptions fails if token missing", %{conn: conn, feed: feed} do
    conn = post conn, subscription_path(conn, :create), subscription: %{feed_id: feed.id}
    assert json_response(conn, 403)["error"] == "Not Authenticated"
  end

  test "PUT /api/subscriptions succeeds", %{conn: conn, jwt: jwt, feed: feed, category: category, user: user} do
    subscription = Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})
    conn = conn |> put_req_header("authorization", jwt)
    conn = put conn, subscription_path(conn, :update, subscription.id), subscription: %{category_id: category.id}

    assert conn.status == 204
    assert Repo.get!(Subscription, subscription.id).category_id == category.id
  end

  test "DELETE /api/subscriptions/:id succeeds", %{conn: conn, jwt: jwt, feed: feed, user: user} do
    subscription = Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})
    conn = conn |> put_req_header("authorization", jwt)
    conn = delete conn, subscription_path(conn, :delete, subscription.id)

    assert conn.status == 204
    refute Repo.get(Subscription, subscription.id)
  end

  test "GET /api/subscriptions succeeds", %{conn: conn, jwt: jwt, feed: feed, user: user} do
    subscription = Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, subscription_path(conn, :index)

    result = List.first(json_response(conn, 200)["subscriptions"])
    assert result["id"] == subscription.id
  end
end
