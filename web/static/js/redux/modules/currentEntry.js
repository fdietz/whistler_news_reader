import { createAction } from "redux-actions";

export const SELECT_ENTRY  = "SELECT_ENTRY";
export const RESET_SELECTION = "RESET_SELECTION";
export const selectEntry = createAction(SELECT_ENTRY);
export const resetSelection = createAction(RESET_SELECTION);

function currentIndex(entries, entry) {
  return entry ? entries.listedIds.findIndex(id => id === entry.id) : 0;
}

function isNextEntry(entries, entry) {
  return currentIndex(entries, entry)+1 < entries.listedIds.length;
}

function isPreviousEntry(entries, entry) {
  return currentIndex(entries, entry)-1 >= 0;
}

export function requestNextEntry() {
  return (dispatch, getState) => {
    const entries = getState().entries;
    const currentEntry = getState().currentEntry;

    if (isNextEntry(entries, currentEntry.entry)) {
      const entryId = entries.listedIds[currentIndex(entries, currentEntry.entry)+1];
      const entry = entries.byId[entryId];
      dispatch(selectEntry({
        entry: entry,
        hasNextEntry: isNextEntry(entries, entry),
        hasPreviousEntry: isPreviousEntry(entries, entry)
      }));
    }
  };
}

export function requestPreviousEntry() {
  return (dispatch, getState) => {
    const entries = getState().entries;
    const currentEntry = getState().currentEntry;

    if (isPreviousEntry(entries, currentEntry.entry)) {
      const entryId = entries.listedIds[currentIndex(entries, currentEntry.entry)-1];
      const entry = entries.byId[entryId];
      dispatch(selectEntry({
        entry: entry,
        hasNextEntry: isNextEntry(entries, entry),
        hasPreviousEntry: isPreviousEntry(entries, entry)
      }));
    }
  };
}

export function requestFirstEntry() {
  return (dispatch, getState) => {
    const entries = getState().entries;

    if (entries.listedIds.length > 0) {
      const entryId = entries.listedIds[0];
      const entry = entries.byId[entryId];
      dispatch(selectEntry({
        entry: entry,
        hasNextEntry: isNextEntry(entries, entry),
        hasPreviousEntry: isPreviousEntry(entries, entry)
      }));
    } else {
      dispatch(resetSelection());
    }
  };
}

export function requestSelectEntry(entry) {
  return (dispatch, getState) => {
    const entries = getState().entries;

    if (entries.listedIds.length > 0) {
      dispatch(selectEntry({
        entry: entry,
        hasNextEntry: isNextEntry(entries, entry),
        hasPreviousEntry: isPreviousEntry(entries, entry)
      }));
    }
  };
}

const initial = {
  entry: null,
  hasNextEntry: false,
  hasPreviousEntry: false
};

export default function reducer(state = initial, action) {
  if (action.type === SELECT_ENTRY) {
    return { ...state, ...action.payload };
  } else if (action.type === RESET_SELECTION) {
    return initial;
  }

  return state;
}
