defmodule WhistlerNewsReader.Feed do
  use WhistlerNewsReader.Web, :model

  @derive {Poison.Encoder, only: [:id, :title, :feed_url, :site_url, :last_updated]}
  schema "feeds" do
    field :title, :string
    field :feed_url, :string
    field :site_url, :string
    field :last_updated, Ecto.DateTime
    has_many :entries, WhistlerNewsReader.Entry

    timestamps
  end

  @required_fields ~w(title feed_url site_url)
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
