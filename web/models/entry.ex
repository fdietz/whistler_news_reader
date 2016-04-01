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
    has_many :unread_entries, WhistlerNewsReader.UnreadEntry

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

  def sorted(query) do
    from p in query,
    order_by: [desc: p.published]
  end

  def gt_last_published(query, last_published) do
    from p in query,
    where: p.published < ^last_published
  end

  def limit(query, limit) do
    from p in query,
    limit: ^limit
  end

  def for_feed(query, feed_id) do
    from p in query,
    where: p.feed_id == ^feed_id
  end

  def for_feeds(query, feed_ids) do
    from p in query,
    where: p.feed_id in ^feed_ids
  end

  def for_today(query) do
    {{year, month, day}, _ } = :calendar.universal_time()
    ecto_date_time = {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl

    from p in query,
    where: p.published >= ^Ecto.DateTime.to_string(ecto_date_time)
  end

  def for_guid(query, guid) do
    from p in query,
    where: p.guid == ^guid
  end

  def unread(query, user_id) do
    from p in query,
    # join condition is handled by ecto for us
    join: c in assoc(p, :unread_entries),
    where: c.user_id == ^user_id,
    where: c.read == ^false,
    preload: [unread_entries: c]
  end

  def read(query, user_id) do
    from p in query,
    # join condition is handled by ecto for us
    join: c in assoc(p, :read_entries),
    where: c.user_id == ^user_id,
    where: c.read == ^true,
    preload: [read_entries: c]
  end
end
