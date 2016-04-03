defmodule WhistlerNewsReader.Category do
  use WhistlerNewsReader.Web, :model

  schema "categories" do
    field :title, :string
    
    # field :user_id, :integer
    belongs_to :user, WhistlerNewsReader.User

    timestamps
  end

  @required_fields ~w(title user_id)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def for_user_id(query, user_id) do
    from p in query,
    where: p.user_id == ^user_id
  end
end
