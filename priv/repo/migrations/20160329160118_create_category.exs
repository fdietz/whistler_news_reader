defmodule WhistlerNewsReader.Repo.Migrations.CreateCategory do
  use Ecto.Migration

  def change do
    create table(:categories) do
      add :title, :string
      add :user_id, :integer

      timestamps
    end

    create unique_index(:categories, [:user_id, :title], name: :categories_user_id_title_index)
  end
end
