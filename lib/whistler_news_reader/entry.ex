defmodule WhistlerNewsReader.Entry do
  use Ecto.Schema   
  import Ecto.Changeset
  import Ecto.Query
  
  @derive {Poison.Encoder, only: [:title, :url, :author, :summary, :content, :guid, :published, :feed]}
  schema "entries" do
    field :title, :string
    field :url, :string
    field :author, :string
    field :summary, :string
    field :content, :string
    field :guid, :string
    field :published, Ecto.DateTime

    #field :feed_id, :integer
    belongs_to :feed, WhistlerNewsReader.Feed
    has_many :unread_entries, WhistlerNewsReader.SubscribedEntry, on_delete: :delete_all

    timestamps
  end

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:feed_id, :title, :url, :guid, :published, :author, :summary, :content])
    |> validate_required([:feed_id, :title, :url, :guid, :published])
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
    {{year, month, day}, _} = :calendar.universal_time()
    ecto_date_time = {{year, month, day}, {0, 0, 0}} |> Ecto.DateTime.from_erl

    from p in query,
    where: p.published >= ^Ecto.DateTime.to_string(ecto_date_time)
  end

  def older_than_given_days(query, days) do
    minus_days = - days;
    from p in query,
    where: p.published <= datetime_add(^Ecto.DateTime.utc, ^minus_days, "day")
  end

  def for_guid(query, guid) do
    from p in query,
    where: p.guid == ^guid
  end

  # def unread_for_user_id(query, user_id) do
  #   from p in query,
  #   # join condition is handled by ecto for us
  #   join: c in assoc(p, :unread_entries),
  #   where: c.user_id == ^user_id,
  #   where: c.read == ^false,
  #   preload: [unread_entries: c]
  # end

  # def unread_for_subscription_ids(query, subscription_ids) do
  #   from p in query,
  #   # join condition is handled by ecto for us
  #   join: c in assoc(p, :unread_entries),
  #   where: c.subscription_id in ^subscription_ids,
  #   where: c.read == ^false,
  #   preload: [unread_entries: c]
  # end

  # TODO
  # def read(query, user_id) do
  #   from p in query,
  #   # join condition is handled by ecto for us
  #   join: c in assoc(p, :read_entries),
  #   where: c.user_id == ^user_id,
  #   where: c.read == ^true,
  #   preload: [read_entries: c]
  # end
end
