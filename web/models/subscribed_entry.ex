defmodule WhistlerNewsReader.SubscribedEntry do
  use WhistlerNewsReader.Web, :model

  schema "subscribed_entries" do

    # field :entry_id, :integer
    belongs_to :entry, WhistlerNewsReader.Entry
    # field :feed_id, :integer
    belongs_to :feed, WhistlerNewsReader.Feed
    # field :user_id, :integer
    belongs_to :user, WhistlerNewsReader.User
    # field :subscription_id, :integer
    belongs_to :subscription, WhistlerNewsReader.Subscription

    field :read, :boolean

    timestamps
  end

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:entry_id, :user_id, :feed_id, :subscription_id, :read])
    |> validate_required([:entry_id, :user_id, :feed_id, :subscription_id])
    |> unique_constraint(:entry_id, name: :subscribed_entries_entry_id_user_id_index)
  end

  def for_feed(query, feed_id) do
    from p in query,
    where: p.feed_id == ^feed_id
  end

  def for_subscription_id(query, subscription_id) do
    from p in query,
    where: p.subscription_id == ^subscription_id
  end

  def for_subscription_ids(query, subscription_ids) do
    from p in query,
    where: p.subscription_id in ^subscription_ids
  end

  def count_for_subscription_ids(query, subscription_ids) do
    from p in query,
    where: p.subscription_id in ^subscription_ids,
    where: p.read == ^false,
    group_by: p.subscription_id,
    select: [p.subscription_id, count(p.id)]
  end

  def for_user_id(query, user_id) do
    from p in query,
    where: p.user_id == ^user_id
  end

  def for_entry_id(query, entry_id) do
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
    join: c in assoc(p, :entry),
    where: c.published >= ^Ecto.DateTime.to_string(ecto_date_time)
  end

  def sorted(query) do
    from p in query,
    join: c in assoc(p, :entry),
    order_by: [desc: c.published]
  end

  def gt_last_published(query, last_published) do
    from p in query,
    join: c in assoc(p, :entry),
    where: c.published < ^last_published
  end

  def limit(query, limit) do
    from p in query,
    limit: ^limit
  end
end
