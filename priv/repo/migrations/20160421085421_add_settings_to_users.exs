defmodule WhistlerNewsReader.Repo.Migrations.AddSettingsToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :settings, :map
    end
  end
end
