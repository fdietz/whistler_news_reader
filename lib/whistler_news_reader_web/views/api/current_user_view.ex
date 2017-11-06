defmodule WhistlerNewsReaderWeb.Api.CurrentUserView do
  use WhistlerNewsReaderWeb, :view

  def render("show.json", %{user: user}) do
    %{user: render_one(user, WhistlerNewsReaderWeb.Api.UserView, "user.json")}
  end

  def render("error.json", _) do
  end
end
