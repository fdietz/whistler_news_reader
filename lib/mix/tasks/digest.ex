defmodule Mix.Tasks.WhistlerNewsReader.Digest do
  use Mix.Task

  def run(args) do
    Mix.Shell.IO.cmd "npm run webpack:build:production"
    :ok = Mix.Tasks.Phoenix.Digest.run(args)
  end
end
