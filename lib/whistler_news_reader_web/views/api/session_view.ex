defmodule WhistlerNewsReaderWeb.Api.SessionView do
  use WhistlerNewsReaderWeb, :view
  require Logger

  def render("show.json", %{jwt: jwt, user: user}) do
    %{
      jwt: jwt,
      user: render_one(user, WhistlerNewsReaderWeb.Api.UserView, "user.json")
    }
  end

  def render("error.json", _) do
    %{errors: [%{base: "invalid email or password"}]}
  end

  def render("delete.json", _) do
    %{ok: true}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end
end
