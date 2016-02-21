# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     WhistlerNewsReader.Repo.insert!(%SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias WhistlerNewsReader.Repo
alias WhistlerNewsReader.User

[
  %{
    first_name: "admin",
    last_name: "admin",
    email: "admin@whistler_news_reader.com",
    password: "abc123"
  },
]

|> Enum.map(&User.changeset(%User{}, &1))
|> Enum.each(&Repo.insert!(&1))
