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

    # check token in Authorization header
    plug Guardian.Plug.VerifyHeader
    # make resource available in Guardian.Plug.current_resource(conn)
    plug Guardian.Plug.LoadResource
  end

  scope "/api", WhistlerNewsReader do
    pipe_through :api

    post "/registrations", Api.RegistrationController, :create
    post "/sessions", Api.SessionController, :create
    delete "/sessions", Api.SessionController, :delete
    get "/current_user", Api.CurrentUserController, :show

    # get "/entries/today", Api.EntryController, :today
    # get "/entries/all", Api.EntryController, :all

    resources "/entries", Api.EntryController, only: [:index]
    put "/entries/refresh", Api.EntryController, :refresh
    put "/entries/:id/mark_as_read", Api.EntryController, :mark_as_read
    resources "/feeds", Api.FeedController, only: [:index, :create, :delete]
    put "/feeds/:id/mark_as_read", Api.FeedController, :mark_as_read
  end

  scope "/", WhistlerNewsReader do
    pipe_through :browser # Use the default browser stack

    get "/*page", PageController, :index
  end

end
