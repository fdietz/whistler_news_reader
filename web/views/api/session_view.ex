defmodule WhistlerNewsReader.Api.SessionView do
  use WhistlerNewsReader.Web, :view
  require Logger

  def render("show.json", %{jwt: jwt, user: user}) do
    %{
      jwt: jwt,
      user: render_one(user, WhistlerNewsReader.Api.UserView, "user.json")
    }
  end

  # def render("user.json", %{user: user}) do
  #   %{
  #     id: user.id,
  #     first_name: user.first_name,
  #     last_name: user.last_name,
  #     email: user.email
  #   }
  # end

  def render("error.json", _) do
    %{error: "invalid email or password"}
  end

  def render("delete.json", _) do
    %{ok: true}
  end

  def render("forbidden.json", %{error: error}) do
    %{error: error}
  end
end
