defmodule WhistlerNewsReader.Subscription do
  use WhistlerNewsReader.Web, :model

  schema "subscriptions" do
    field :feed_id, :integer
    field :user_id, :integer

    timestamps
  end

  @required_fields ~w(feed_id user_id)
  @optional_fields ~w()

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
end
