defmodule WhistlerNewsReader.Api.CurrentUserView do
  use WhistlerNewsReader.Web, :view

  def render("show.json", %{user: user}) do
    %{user: render_one(user, WhistlerNewsReader.Api.UserView, "user.json")}
  end

  def render("error.json", _) do
  end
end
