defmodule WhistlerNewsReader.Feed do
  use Ecto.Schema   
  import Ecto.Changeset
  import Ecto.Query
  
  @derive {Poison.Encoder, only: [:id, :title, :feed_url, :site_url, :last_updated]}
  schema "feeds" do
    field :title, :string
    field :feed_url, :string
    field :site_url, :string
    field :last_refreshed_at, Ecto.DateTime
    has_many :entries, WhistlerNewsReader.Entry, on_delete: :delete_all
    has_many :subscriptions, WhistlerNewsReader.Subscription, on_delete: :delete_all

    timestamps
  end

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:title, :feed_url, :site_url, :last_refreshed_at])
    |> validate_required([:title, :feed_url, :site_url])
    |> unique_constraint(:feed_url)
  end

  def subscribed_by_user(query, user_id) do
    from p in query,
    # join condition is handled by ecto for us
    join: c in assoc(p, :subscriptions),
    where: c.user_id == ^user_id,
    preload: [subscriptions: c]
  end

  def subscribed_by_user_for_category_id(query, user_id, category_id) do
    from p in query,
    # join condition is handled by ecto for us
    join: c in assoc(p, :subscriptions),
    where: c.user_id == ^user_id,
    where: c.category_id == ^category_id,
    preload: [subscriptions: c]
  end

  def for_feed_url(query, feed_url) do
    from p in query,
    where: p.feed_url == ^feed_url
  end

  # TODO: use postgres search instead
  def search_by(query, queryString) do
    from p in query,
    where: like(p.title, ^("%#{queryString}%")) or like(p.feed_url, ^("%#{queryString}%")) or like(p.site_url, ^("%#{queryString}%"))
  end

  def count_for_user_id_and_category_id(query, user_id, category_id) do
    from p in query,
    # join condition is handled by ecto for us
    join: c in assoc(p, :subscriptions),
    where: c.user_id == ^user_id,
    where: c.category_id == ^category_id,
    select: count(p.id)
  end
end
