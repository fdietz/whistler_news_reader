defmodule WhistlerNewsReader.Mixfile do
  use Mix.Project

  def project do
    [app: :whistler_news_reader,
     version: "0.0.1",
     elixir: "~> 1.4.1",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases(),
     deps: deps()]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [mod: {WhistlerNewsReader, []},
     applications: [:phoenix, :phoenix_pubsub, :phoenix_html, :cowboy, :logger,
                    :phoenix_ecto, :postgrex, :tzdata, :comeonin, :gproc, :gettext]]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies
  #
  # Type `mix help deps` for examples and options
  defp deps do
    [{:phoenix, "~> 1.2.1"},
     {:phoenix_ecto, "~> 3.0.1"},
     {:postgrex, ">= 0.12.0"},
     {:phoenix_html, "~> 2.6.2"},
     {:phoenix_pubsub, "~> 1.0"},
     {:phoenix_live_reload, "~> 1.0.5", only: :dev},
     {:cowboy, "~> 1.0.4"},
     {:gettext, "~> 0.11"},
     {:elixir_feed_parser, "~> 2.0.0"},
     {:httpoison, "~> 0.9.0"},
     {:floki, "~> 0.10.0"},
     {:comeonin, "~> 2.5.2"},
     {:guardian, "~> 0.12.0"},
     {:ex_machina, "~> 1.0.2", only: :test},
     {:mock, "~> 0.1.3", only: :test},
     {:elixir_gravatar_url, "~> 1.0.0"},
     {:poolboy, "~> 1.5.1"},
     {:html_sanitize_ex, "~> 1.0.1"},
     {:poison, "~> 2.2.0"},
     {:gproc, "~> 0.6.1"},
     {:hound, "~> 1.0.3"},
     {:credo, "~> 0.4.8", only: [:dev, :test]},
     {:mogrify, "~> 0.4.0"}]
  end

  defp aliases do
    ["phoenix.digest": "whistler_news_reader.digest",
     "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"],
     "test": ["ecto.create --quiet", "ecto.migrate", "test"]]
  end
end
