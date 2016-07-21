defmodule WhistlerNewsReader.Mixfile do
  use Mix.Project

  def project do
    [app: :whistler_news_reader,
     version: "0.0.1",
     elixir: "~> 1.0",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: ["phoenix.digest": "whistler_news_reader.digest"],
     deps: deps]
  end

  # Configuration for the OTP application
  #
  # Type `mix help compile.app` for more information
  def application do
    [mod: {WhistlerNewsReader, []},
     applications: [:phoenix, :phoenix_html, :cowboy, :logger,
                    :phoenix_ecto, :postgrex, :tzdata, :comeonin, :gproc]]
  end

  # Specifies which paths to compile per environment
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies
  #
  # Type `mix help deps` for examples and options
  defp deps do
    [{:phoenix, "~> 1.1.2"},
     {:phoenix_ecto, "~> 2.0"},
     {:postgrex, ">= 0.0.0"},
     {:phoenix_html, "~> 2.3"},
     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:cowboy, "~> 1.0"},
     {:elixir_feed_parser, "~> 1.1.0"},
     {:httpoison, "~> 0.8.2"},
     {:floki, "~> 0.7.1"},
     {:comeonin, "~> 2.0"},
     {:guardian, "~> 0.9.0"},
     {:ex_machina, "~> 0.6.1", only: :test},
     {:mock, "~> 0.1.1", only: :test},
     {:elixir_gravatar_url, "~> 1.0.0"},
     {:poolboy, "~> 1.5.1"},
     {:html_sanitize_ex, "~> 0.1.0"},
     {:poison, "~> 1.5.0"},
     {:gproc, "~> 0.5.0"}]
  end
end
