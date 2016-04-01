defmodule WhistlerNewsReader.UnreadEntry do
  use WhistlerNewsReader.Web, :model

  schema "unread_entries" do

    # field :entry_id, :integer
    belongs_to :entry, WhistlerNewsReader.Entry
    # field :feed_id, :integer
    belongs_to :feed, WhistlerNewsReader.Feed
    # field :user_id, :integer
    belongs_to :user, WhistlerNewsReader.User

    field :read, :boolean

    timestamps
  end

  @required_fields ~w(entry_id user_id feed_id)
  @optional_fields ~w(read)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> unique_constraint(:entry_id, name: :unread_entries_entry_id_user_id_index)
  end

  def for_feed(query, feed_id) do
    from p in query,
    where: p.feed_id == ^feed_id
  end

  def count_for_feeds(query, feed_ids) do
    from p in query,
    where: p.feed_id in ^feed_ids,
    where: p.read == ^false,
    group_by: p.feed_id,
    select: [p.feed_id, count(p.id)]
  end

  def for_user(query, user_id) do
    from p in query,
    where: p.user_id == ^user_id
  end

  def for_entry(query, entry_id) do
    from p in query,
    where: p.entry_id == ^entry_id
  end

  def for_unread(query) do
    from p in query,
    where: p.read == ^false
  end

  def for_today(query) do
    {{year, month, day}, _ } = :calendar.universal_time()
    ecto_date_time = {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl

    from p in query,
    # join condition is handled by ecto for us
    join: c in assoc(p, :entry),
    where: c.published >= ^Ecto.DateTime.to_string(ecto_date_time)
  end
end
