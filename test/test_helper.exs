{:ok, _} = Application.ensure_all_started(:ex_machina)
{:ok, _} = Application.ensure_all_started(:hound)

ExUnit.start

# Mix.Task.run "ecto.create", ["--quiet"]
# Mix.Task.run "ecto.migrate", ["--quiet"]
# Ecto.Adapters.SQL.begin_test_transaction(WhistlerNewsReader.Repo)
Ecto.Adapters.SQL.Sandbox.mode(WhistlerNewsReader.Repo, :manual)
