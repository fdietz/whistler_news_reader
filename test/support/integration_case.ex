defmodule WhistlerNewsReader.IntegrationCase do
  use ExUnit.CaseTemplate
  use Hound.Helpers

  import WhistlerNewsReader.Factory

  alias WhistlerNewsReader.User

  using do
    quote do
      use Hound.Helpers

      import Ecto.Model
      import Ecto.Query, only: [from: 2]
      import WhistlerNewsReader.Router.Helpers
      import WhistlerNewsReader.Factory
      import WhistlerNewsReader.IntegrationCase

      alias WhistlerNewsReader.Repo

      # The default endpoint for testing
      @endpoint WhistlerNewsReader.Endpoint

      hound_session
    end
  end

  setup tags do
    unless tags[:async] do
      Ecto.Adapters.SQL.restart_test_transaction(WhistlerNewsReader.Repo, [])
    end

    :ok
  end

  def create_user do
    build(:user)
    |> User.changeset(%{password: "12345678"})
    |> Repo.insert!
  end

  def user_sign_in(%{user: user}) do
    navigate_to "/"

    sign_in_form = find_element(:id, "sign_in_form")

    sign_in_form
    |> find_within_element(:id, "user_email")
    |> fill_field(user.email)

    sign_in_form
    |> find_within_element(:id, "user_password")
    |> fill_field(user.password)

    sign_in_form
    |> find_within_element(:css, "button")
    |> click

    assert element_displayed?({:id, "authentication_container"})
  end
end