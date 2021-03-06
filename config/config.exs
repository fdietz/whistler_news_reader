# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :whistler_news_reader, WhistlerNewsReaderWeb.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "GIp8OnuW3ex0mkgsun4RN6XpAz4NImG9vH6neqxYXo++FinVSah222qUmwm7/Hug",
  render_errors: [accepts: ~w(html json)]
  # pubsub: [name: WhistlerNewsReader.PubSub,
          #  adapter: Phoenix.PubSub.PG2]

config :whistler_news_reader, ecto_repos: [WhistlerNewsReader.Repo]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false

config :guardian, Guardian,
  issuer: "WhistlerNewsReader",
  ttl: {3, :days},
  verify_issuer: true,
  secret_key: "",
  serializer: WhistlerNewsReader.GuardianSerializer

config :hound, driver: "chrome_driver"
# config :hound, driver: "phantomjs"
