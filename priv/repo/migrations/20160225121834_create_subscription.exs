defmodule WhistlerNewsReader.Repo.Migrations.CreateSubscription do
  use Ecto.Migration

  def change do
    create table(:subscriptions) do
      add :feed_id, :integer
      add :user_id, :integer

      timestamps
    end

    create unique_index(:subscriptions, [:feed_id, :user_id], :subscriptions_feed_id_user_id_index)
  end
end
