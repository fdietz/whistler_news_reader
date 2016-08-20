defmodule WhistlerNewsReader.Category do
  use WhistlerNewsReader.Web, :model

  schema "categories" do
    field :title, :string

    embeds_one :settings, WhistlerNewsReader.Settings, on_replace: :delete

    # field :user_id, :integer
    belongs_to :user, WhistlerNewsReader.User

    timestamps
  end

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:title, :user_id])
    |> validate_required([:title, :user_id])
    |> unique_constraint(:user_id, name: :categories_user_id_title_index)
    |> cast_embed(:settings)
  end

  def for_user_id(query, user_id) do
    from p in query,
    where: p.user_id == ^user_id
  end

  def for_title(query, title) do
    from p in query,
    where: p.title == ^title
  end
end
