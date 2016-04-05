defmodule WhistlerNewsReader.OpmlImport do
  alias WhistlerNewsReader.OpmlParser
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.Category

  require Logger

  def import(user, xml_body) do
    opml = OpmlParser.parse(xml_body)
    Enum.each(opml, fn(category) ->
      IO.puts category[:title]

      Logger.info "OpmlImport - create category: #{category[:title]}"

      category = %Category{}
      |> Category.changeset(%{title: category[:title], user_id: user.id})
      |> Repo.insert!(category)

      Enum.each(category[:feeds], fn(feed) ->
        Logger.info "OpmlImport - create feed: #{feed[:title]}"

        FeedImporter.import_feed(user, %{"feed_url" => feed[:feedurl], "category_id" => category.id})
      end)
    end)
  end
end
