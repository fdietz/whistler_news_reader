
defmodule WhistlerNewsReader.Api.EntryControllerTest do
  use WhistlerNewsReader.ConnCase

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.User
  alias WhistlerNewsReader.Feed
  alias WhistlerNewsReader.Entry
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
    user = Repo.insert!(%User{
      email: "test@test.de",
      first_name: "Donald",
      last_name: "Duck",
      encrypted_password: "password"
    })

    {:ok, jwt, _full_claims} = Guardian.encode_and_sign(user, :token)

    changeset = %Feed{} |> Feed.changeset(@valid_feed_attrs)
    feed      = Repo.insert!(changeset)
    changeset = %Feed{} |> Feed.changeset(@valid_feed_attrs2)
    feed2      = Repo.insert!(changeset)
    changeset = %Feed{} |> Feed.changeset(@valid_feed_attrs3)
    feed3      = Repo.insert!(changeset)

    Repo.insert!(%Subscription{feed_id: feed.id, user_id: user.id})
    Repo.insert!(%Subscription{feed_id: feed2.id, user_id: user.id})

    # TODO: fix - 1 day arithmetic
    {{year, month, day}, _ } = :calendar.universal_time()
    entry  = Repo.insert!(%Entry{feed_id: feed.id, title: "test1", published: {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl})
    entry2 = Repo.insert!(%Entry{feed_id: feed2.id, title: "test2", published: {{year, month, day-1}, {0, 0, 0}} |> Ecto.DateTime.from_erl})
    entry3 = Repo.insert!(%Entry{feed_id: feed3.id, title: "test3", published: {{year, month, day-2}, {0, 0, 0}} |> Ecto.DateTime.from_erl})

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, jwt: jwt, feed: feed, feed2: feed2, feed3: feed3, entry: entry, entry2: entry2, entry3: entry3}
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
end
