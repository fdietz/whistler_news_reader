defmodule WhistlerNewsReader.Repo.Migrations.CreateUnreadEntry do
  use Ecto.Migration

  def change do
    create table(:unread_entries) do
      add :entry_id, :integer
      add :user_id, :integer
      add :feed_id, :integer

      timestamps
    end

    create unique_index(:unread_entries, [:entry_id, :user_id], name: :unread_entries_entry_id_user_id_index)
  end
end
