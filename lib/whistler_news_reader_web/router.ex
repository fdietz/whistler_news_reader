defmodule WhistlerNewsReaderWeb.Router do
  use WhistlerNewsReaderWeb, :router

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

  scope "/api", WhistlerNewsReaderWeb do
    pipe_through :api

    post "/registrations", Api.RegistrationController, :create
    post "/sessions", Api.SessionController, :create
    delete "/sessions", Api.SessionController, :delete
    get "/current_user", Api.CurrentUserController, :show

    resources "/subscribed_entries", Api.SubscribedEntryController, only: [:index]

    get "/subscribed_entries/:id/image/:dimensions", Api.SubscribedEntryImageController, :show

    put "/subscribed_entries/:id/mark_as_read", Api.SubscribedEntryController, :mark_as_read
    put "/subscribed_entries/mark_all_as_read", Api.SubscribedEntryController, :mark_all_as_read

    resources "/feeds", Api.FeedController, only: [:index, :show, :create, :update, :delete]
    put "/feeds/:id/update_category", Api.FeedController, :update_category

    resources "/categories", Api.CategoryController, only: [:index, :show, :create, :update, :delete]

    resources "/subscriptions", Api.SubscriptionController

    resources "/entry_articles", Api.EntryArticleController, only: [:show]

    post "/imports", Api.ImportController, :create
    get "/random_images", Api.RandomImageController, :index
  end

  scope "/", WhistlerNewsReaderWeb do
    pipe_through :browser # Use the default browser stack

    get "/*page", PageController, :index
  end

end
