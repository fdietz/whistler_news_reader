defmodule WhistlerNewsReader.Repo.Migrations.AddSettingsToSubscriptions do
  use Ecto.Migration

  def change do
    alter table(:subscriptions) do
      add :settings, :map
    end
  end
end
