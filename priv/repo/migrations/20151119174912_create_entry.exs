defmodule WhistlerNewsReader.Repo.Migrations.CreateEntry do
  use Ecto.Migration

  def change do
    create table(:entries) do
      add :feed_id, :integer
      add :title, :string
      add :url, :string
      add :author, :string
      add :summary, :text
      add :content, :text
      add :guid, :string
      add :published, :datetime

      timestamps
    end

    create unique_index(:entries, [:guid])
  end
end
