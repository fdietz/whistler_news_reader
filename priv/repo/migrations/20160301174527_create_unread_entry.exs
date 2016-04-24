defmodule WhistlerNewsReader.Repo.Migrations.CreateSubscribedEntry do
  use Ecto.Migration

  def change do
    create table(:subscribed_entries) do
      add :entry_id, :integer
      add :user_id, :integer
      add :feed_id, :integer
      add :read, :boolean, default: false

      timestamps
    end

    create unique_index(:subscribed_entries, [:entry_id, :user_id], name: :subscribed_entries_entry_id_user_id_index)
    create index(:subscribed_entries, [:user_id, :read, :entry_id])
  end
end
