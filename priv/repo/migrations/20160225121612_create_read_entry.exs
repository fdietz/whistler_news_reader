defmodule WhistlerNewsReader.Repo.Migrations.CreateReadEntry do
  use Ecto.Migration

  def change do
    create table(:read_entries) do
      add :entry_id, :integer
      add :feed_id, :integer
      add :user_id, :integer

      timestamps
    end

    create unique_index(:read_entries, [:entry_id, :user_id], name: :read_entries_entry_id_user_id_index)
  end
end
