defmodule WhistlerNewsReader.Repo.Migrations.AddSubscriptionIdToSubscribedEntries do
  use Ecto.Migration

  def change do
    alter table(:subscribed_entries) do
      add :subscription_id, :integer
    end
  end
end
