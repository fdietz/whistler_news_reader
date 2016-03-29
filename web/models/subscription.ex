defmodule WhistlerNewsReader.Subscription do
  use WhistlerNewsReader.Web, :model

  schema "subscriptions" do
    # field :user_id, :integer
    belongs_to :user, WhistlerNewsReader.User
    # field :feed_id, :integer
    belongs_to :feed, WhistlerNewsReader.Feed

    field :category_id, :integer

    timestamps
  end

  @required_fields ~w(feed_id user_id)
  @optional_fields ~w(category_id)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:feed_id, name: :subscriptions_feed_id_user_id_index)
  end

  def for_feed(query, feed_id) do
    from p in query,
    where: p.feed_id == ^feed_id
  end

  def for_user(query, user_id) do
    from p in query,
    where: p.user_id == ^user_id
  end
end
