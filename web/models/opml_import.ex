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
    Enum.each(opml, fn(category) ->
      IO.puts category[:title]

      Logger.info "OpmlImport - find or create category: #{category[:title]}"
      c = find_or_create_category(category[:title], user)

      Enum.each(category[:feeds], fn(feed) ->
        Logger.info "OpmlImport - importing feed: #{feed[:title]}"

        case FeedImporter.import_feed(user, %{"feed_url" => feed[:xmlurl], "category_id" => c.id}) do
          {:ok, imported_feed} ->
            Logger.info "OpmlImport - success for feed_url #{feed[:xmlurl]}"
          {:error, %Ecto.Changeset{} = changeset} ->
            Logger.error "OpmlImport - failed for feed_url #{feed[:xmlurl]} with #{inspect(changeset.errors)}"
          {:error, error} ->
            Logger.error "OpmlImport - failed for feed_url #{feed[:xmlurl]} with #{inspect(error)}"
        end
      end)
    end)
  end

  defp find_or_create_category(title, user) do
    case %Category{}
         |> Category.changeset(%{title: title, user_id: user.id})
         |> Repo.insert do
      {:ok, new_category} ->
        new_category
      {:error, changeset} ->
        Repo.get_by!(Category, title: title, user_id: user.id)
    end
  end
end
