defmodule WhistlerNewsReader.WebpackTemplateHelper do

  require Logger

  def webpack_devserver do
    case HTTPoison.get("http://localhost:4001/index.html") do
      {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
        body
      other ->
        Logger.error "WebpackTemplateHelper - error retrieving template from webpack devserver"
        other
    end
  end

  def webpack_file_system do
    case File.read("./priv/static/index.html") do
      {:ok, body}      ->
        body
      {:error, reason} ->
        Logger.error "WebpackTemplateHelper - error retrieving template from local filesystem #{reason}. Did you run the webpack build?"
        reason
    end
  end
end
