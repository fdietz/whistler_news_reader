defmodule WhistlerNewsReader.Repo.Migrations.CreateFeed do
  use Ecto.Migration

  def change do
    create table(:feeds) do
      add :title, :string
      add :feed_url, :string
      add :site_url, :string
      add :last_refreshed_at, :datetime

      timestamps
    end

    create unique_index(:feeds, [:feed_url])
  end
end
