defmodule WhistlerNewsReader.OpmlImport do

  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.OpmlParser
  alias WhistlerNewsReader.Category
  alias WhistlerNewsReader.FeedServer

  require Logger

  # WhistlerNewsReader.OpmlImport.import(WhistlerNewsReader.Repo.get!(WhistlerNewsReader.User, 1), File.read!("test/fixtures/opml/example1.opml"))

  def import(user, xml_body) do
    opml = OpmlParser.parse(xml_body)
    Enum.each(opml, fn(category_attrs) ->
      Logger.info "OpmlImport - find or create category: #{category_attrs[:title]}"
      category = find_or_create_category(category_attrs[:title], user)

      feed_attrs_enum = Enum.map(category_attrs[:feeds], fn(feed_attrs) ->
        %{"feed_url" => feed_attrs[:xmlurl], "category_id" => category.id}
      end)

      FeedServer.import_all(user, feed_attrs_enum, subscribe_user: true)
    end)
  end

  defp find_or_create_category(title, user) do
    case create_category(title, user) do
      {:ok, category} ->
        category
      {:error, _changeset} ->
        Repo.get_by!(Category, title: title, user_id: user.id)
    end
  end

  defp create_category(title, user) do
    %Category{}
      |> Category.changeset(%{title: title, user_id: user.id})
      |> Repo.insert
  end
end
