defmodule WhistlerNewsReader.Entry do
  use WhistlerNewsReader.Web, :model

  @derive {Poison.Encoder, only: [:title, :url, :author, :summary, :content, :guid, :published, :feed]}
  schema "entries" do
    #field :feed_id, :integer
    field :title, :string
    field :url, :string
    field :author, :string
    field :summary, :string
    field :content, :string
    field :guid, :string
    field :published, Ecto.DateTime
    belongs_to :feed, WhistlerNewsReader.Feed

    timestamps
  end

  @required_fields ~w(feed_id title url guid published)
  @optional_fields ~w(author summary content)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:guid)
  end

  # def published(query) do
  #   from p in query,
  #   where: p.published == true
  # end

  def sorted(query) do
    from p in query,
    order_by: [desc: p.published]
  end

  def load_more(query, last_published, limit) do
    from p in query,
    where: p.published < ^last_published,
    limit: ^limit
  end

  def limit(query, limit) do
    from p in query,
    limit: ^limit
  end

  def for_feed(query, feed_id) do
    from p in query,
    where: p.feed_id == ^feed_id
  end

  def for_today(query) do
    from p in query,
    where: p.published >= ^Ecto.DateTime.to_string(Ecto.DateTime.utc)
  end

  def for_guid(query, guid) do
    from p in query,
    where: p.guid == ^guid
  end

end
