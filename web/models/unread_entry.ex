defmodule WhistlerNewsReader.UnreadEntry do
  use WhistlerNewsReader.Web, :model

  schema "unread_entries" do

    # field :entry_id, :integer
    belongs_to :entry, WhistlerNewsReader.Entry
    # field :feed_id, :integer
    belongs_to :feed, WhistlerNewsReader.Feed
    # field :user_id, :integer
    belongs_to :user, WhistlerNewsReader.User

    timestamps
  end

  @required_fields ~w(entry_id user_id feed_id)
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
end
