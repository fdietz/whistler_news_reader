defmodule WhistlerNewsReaderWeb.Api.UserView do
  use WhistlerNewsReaderWeb, :view

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      name: user.name,
      email: user.email,
      image_url: gravatar_url(user.email)
    }
  end

  defp gravatar_url(email) do
    ElixirGravatarUrl.url(email, s: 128)
  end
end
