defmodule WhistlerNewsReader.SignUpTest do
  use WhistlerNewsReader.IntegrationCase

  @tag :integration
  test "GET /sign_up" do
    navigate_to "/sign_up"

    assert page_title() == "whistler news reader (PHOENIX)"
    assert element_displayed?({:id, "sign_up_form"})
  end

  @tag :integration
  test "Siginig up with correct data" do
    navigate_to "/sign_up"

    assert element_displayed?({:id, "sign_up_form"})

    sign_up_form = find_element(:id, "sign_up_form")

    sign_up_form
    |> find_within_element(:id, "name")
    |> fill_field("John Doe")

    sign_up_form
    |> find_within_element(:id, "email")
    |> fill_field("john@doe.com")

    sign_up_form
    |> find_within_element(:id, "password")
    |> fill_field("12345678")

    sign_up_form
    |> find_within_element(:id, "password_confirm")
    |> fill_field("12345678")

    sign_up_form
    |> find_within_element(:css, "button")
    |> click

    assert element_displayed?({:class, "authenticated-container"})
  end
end
