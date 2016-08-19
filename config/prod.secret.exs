use Mix.Config

# In this file, we keep production configuration that
# you likely want to automate and keep it away from
# your version control system.
config :whistler_news_reader, WhistlerNewsReader.Endpoint,
  secret_key_base: System.get_env("SECRET_KEY_BASE")

# Configure your database
config :whistler_news_reader, WhistlerNewsReader.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: System.get_env("DATABASE_URL"),
  database: "whistler_news_reader_prod",
  pool_size: 1

config :guardian, Guardian,
  secret_key: System.get_env("GUARDIAN_SECRET_KEY")
