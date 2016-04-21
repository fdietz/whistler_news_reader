defmodule WhistlerNewsReader.Settings do
  use WhistlerNewsReader.Web, :model

  embedded_schema do
    field :view_type, :string
    field :open_in_website_directly, :boolean
  end

  @required_fields ~w()
  @optional_fields ~w(view_type open_in_website_directly)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> validate_inclusion(:view_type, ~w(list compact_list grid))
  end
end
