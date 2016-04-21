defmodule WhistlerNewsReader.Repo.Migrations.AddSettingsToCategories do
  use Ecto.Migration

  def change do
    alter table(:categories) do
      add :settings, :map
    end
  end
end
