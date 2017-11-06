defmodule WhistlerNewsReader.StoreEntryHelper do

  alias WhistlerNewsReader.Entry
  alias WhistlerNewsReader.Repo
  alias WhistlerNewsReader.MarkAsReadHelper
  alias WhistlerNewsReader.EntryParser

  require Logger

  def store_entries(feed, entries) do
    result = Enum.map(entries, fn(entry) ->
      case store_entry(feed, entry) do
        {:ok, :skipping} ->
          nil
        {:ok, entry} ->
          entry
        _other ->
          nil
      end
    end)

    Enum.reject(result, fn(e) -> e == nil end)
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
