defmodule WhistlerNewsReader.Repo.Migrations.CreateCategory do
  use Ecto.Migration

  def change do
    create table(:categories) do
      add :title, :string
      add :user_id, :integer

      timestamps
    end

  end
end
