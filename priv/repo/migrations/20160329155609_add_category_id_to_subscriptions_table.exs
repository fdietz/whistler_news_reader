defmodule WhistlerNewsReader.Repo.Migrations.AddCategoryIdToSubscriptionsTable do
  use Ecto.Migration

  def change do
    alter table(:subscriptions) do
      add :category_id, :integer
    end
  end
end
