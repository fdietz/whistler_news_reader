defmodule WhistlerNewsReader.Api.CategoryView do
  use WhistlerNewsReader.Web, :view

  def render("index.json", %{categories: categories}) do
    %{categories: render_many(categories, WhistlerNewsReader.Api.CategoryView, "category.json")}
  end

  def render("show.json", %{category: category}) do
    %{category: render_one(category, WhistlerNewsReader.Api.CategoryView, "category.json")}
  end

  def render("category.json", %{category: category}) do
    %{
      id: category.id,
      title: category.title,
      expanded: false
     }
  end
end
