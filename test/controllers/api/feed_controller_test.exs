defmodule WhistlerNewsReader.Api.FeedControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Subscription

  setup do
    user = Repo.insert!(%User{
      email: "test@test.de",
      first_name: "Donald",
      last_name: "Duck",
      encrypted_password: "password"
    })

    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    feed = Repo.insert!(%Feed{
      title: "The Verge",
      feed_url: "http://theverge.com/feed.rss",
      site_url: "http://theverge.com"
    })

    # subscription = Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed}
  end

  test "GET / succeeds with token", %{conn: conn, jwt: jwt, feed: feed} do
    conn = conn |> put_req_header("authorization", jwt)
    conn = get conn, feed_path(conn, :index)

    result = List.first(json_response(conn, 200)["feeds"])
    assert result["id"] == feed.id
    assert result["title"] == feed.title
  end

  test "GET / fails if no token", %{conn: conn} do
    conn = get conn, feed_path(conn, :index)
    assert json_response(conn, 403)["error"] == "Not Authenticated"
  end
end
