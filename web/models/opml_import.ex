defmodule WhistlerNewsReader.OpmlImport do

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.OpmlParser
  alias WhistlerNewsReader.Category
  alias WhistlerNewsReader.FeedImporter
  alias WhistlerNewsReader.ErrorHelper

  require Logger

  # user = WhistlerNewsReader.Repo.get!(WhistlerNewsReader.User, 1)
  # xml_body = File.read!("test/fixtures/opml/example1.opml")
    # WhistlerNewsReader.OpmlImport.import(user, xml_body)

  def import(user, xml_body) do
    opml = OpmlParser.parse(xml_body)
    Enum.each(opml, fn(category_attrs) ->
      IO.puts category_attrs[:title]

      Logger.info "OpmlImport - find or create category: #{category_attrs[:title]}"
      category = find_or_create_category(category_attrs[:title], user)

      Enum.each(category_attrs[:feeds], fn(feed_attrs) ->
        Logger.info "OpmlImport - importing feed: #{feed_attrs[:title]}"

        attrs = %{"feed_url" => feed_attrs[:xmlurl], "category_id" => category.id}
        case FeedImporter.import_feed(user, attrs) do
          {:ok, imported_feed} ->
            Logger.info "OpmlImport - success for feed_url #{feed_attrs[:xmlurl]}"
          {:error, %Ecto.Changeset{} = changeset} ->
            Logger.error "OpmlImport - failed for feed_url #{feed_attrs[:xmlurl]} with #{inspect(changeset.errors)}"
          {:error, error} ->
            Logger.error "OpmlImport - failed for feed_url #{feed_attrs[:xmlurl]} with #{inspect(error)}"
        end
      end)
    end)
  end

  defp find_or_create_category(title, user) do
    case create_category(title, user) do
      {:ok, category} ->
        category
      {:error, changeset} ->
        Repo.get_by!(Category, title: title, user_id: user.id)
    end
  end

  defp create_category(title, user) do
    %Category{}
      |> Category.changeset(%{title: title, user_id: user.id})
      |> Repo.insert
  end
end
