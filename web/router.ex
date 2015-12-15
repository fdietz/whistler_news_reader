defmodule WhistlerNewsReader.Router do
  use WhistlerNewsReader.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", WhistlerNewsReader do
    pipe_through :api

    # get "/entries/today", Api.EntryController, :today
    # get "/entries/all", Api.EntryController, :all
    resources "/entries", Api.EntryController, only: [:index]
    put "/entries/refresh", Api.EntryController, :refresh
    resources "/feeds", Api.FeedController, only: [:index]
  end

  scope "/", WhistlerNewsReader do
    pipe_through :browser # Use the default browser stack

    get "/*page", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", WhistlerNewsReader do
  #   pipe_through :api
  # end
end
