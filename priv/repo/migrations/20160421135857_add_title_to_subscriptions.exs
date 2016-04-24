defmodule WhistlerNewsReader.Repo.Migrations.AddTitleToSubscriptions do
  use Ecto.Migration

  def change do
    alter table(:subscriptions) do
      add :title, :string
    end
  end
end
