defmodule WhistlerNewsReader.Api.UserView do
  use WhistlerNewsReader.Web, :view

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    }
  end

end
