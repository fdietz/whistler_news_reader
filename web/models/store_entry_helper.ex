defmodule WhistlerNewsReader.StoreEntryHelper do

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.MarkAsReadHelper
  alias WhistlerNewsReader.EntryParser

  require Logger

  def store_entries(feed, entries) do
    Enum.map(entries, fn(entry) ->
      case store_entry(feed, entry) do
        {:ok, :skipping} ->
          Logger.debug "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} skip"
          {:ok}
        {:ok, _new_entry} ->
          Logger.debug "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} success"
          {:ok}
        {:error, %Ecto.Changeset{} = changeset} ->
          Logger.debug "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} changeset error: #{inspect changeset.errors}"
          {:error}
        {:error, error} ->
          Logger.error "FeedRefresher - refresh feed id: #{feed.id}, entry id: #{entry.id} error: #{inspect error}"
          {:error}
      end
    end)
  end

  def store_entry(feed, parsed_entry) do
    entry_attrs = EntryParser.parse(feed, parsed_entry)
    case insert_or_skip(entry_attrs) do
      {:ok, :skipping} ->
        {:ok, :skipping}
      {:ok, entry} ->
        MarkAsReadHelper.mark_as_unread_entry(entry)
        {:ok, entry}
      error ->
        error
    end
  end

  defp insert_or_skip(entry_attrs) do
    if Repo.get_by(Entry, guid: entry_attrs[:guid]) do
      {:ok, :skipping}
    else
      entry = %Entry{} |> Entry.changeset(entry_attrs) |> Repo.insert
      case entry do
        {:ok, entry} ->
          {:ok, entry}
        error ->
          error
      end
    end
  end

end
