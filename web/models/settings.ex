defmodule WhistlerNewsReader.Settings do
  use WhistlerNewsReader.Web, :model

  embedded_schema do
    field :view_type, :string
    field :open_in_website_directly, :boolean
  end

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:view_type, :open_in_website_directly])
    |> validate_required([])
    |> validate_inclusion(:view_type, ~w(list compact_list grid))
  end
end
