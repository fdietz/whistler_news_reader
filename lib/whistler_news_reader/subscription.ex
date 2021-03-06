defmodule WhistlerNewsReader.Subscription do
  use Ecto.Schema   
  import Ecto.Changeset
  import Ecto.Query
  
  schema "subscriptions" do

    field :title, :string
    embeds_one :settings, WhistlerNewsReader.Settings, on_replace: :delete
    # field :user_id, :integer
    belongs_to :user, WhistlerNewsReader.User
    # field :feed_id, :integer
    belongs_to :feed, WhistlerNewsReader.Feed
    # field :category_id, :integer
    belongs_to :category, WhistlerNewsReader.Category

    timestamps
  end

  @required_fields ~w(feed_id user_id)
  @optional_fields ~w(category_id title)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:feed_id, :user_id, :category_id, :title])
    |> validate_required([:feed_id, :user_id])
    |> unique_constraint(:feed_id, name: :subscriptions_feed_id_user_id_index)
    |> cast_embed(:settings)
  end

  def for_feed_id(query, feed_id) do
    from p in query,
    where: p.feed_id == ^feed_id
  end

  def for_user_id(query, user_id) do
    from p in query,
    where: p.user_id == ^user_id
  end

  def for_category_id(query, category_id) do
    from p in query,
    where: p.category_id == ^category_id
  end
end
