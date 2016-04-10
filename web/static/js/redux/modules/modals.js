import { createAction } from "redux-actions";

export const OPEN_NEW_FEED_MODAL  = "OPEN_NEW_FEED_MODAL";
export const CLOSE_NEW_FEED_MODAL  = "CLOSE_NEW_FEED_MODAL";
export const OPEN_NEW_CATEGORY_MODAL  = "OPEN_NEW_CATEGORY_MODAL";
export const CLOSE_NEW_CATEGORY_MODAL  = "CLOSE_NEW_CATEGORY_MODAL";
export const OPEN_EDIT_FEED_OR_CATEGORY_MODAL  = "OPEN_EDIT_FEED_OR_CATEGORY_MODAL";
export const CLOSE_EDIT_FEED_OR_CATEGORY_MODAL  = "CLOSE_EDIT_FEED_OR_CATEGORY_MODAL";
export const OPEN_ENTRY_CONTENT_MODAL  = "OPEN_ENTRY_CONTENT_MODAL";
export const CLOSE_ENTRY_CONTENT_MODAL  = "CLOSE_ENTRY_CONTENT_MODAL";

export const openNewFeedModal = createAction(OPEN_NEW_FEED_MODAL);
export const closeNewFeedModal = createAction(CLOSE_NEW_FEED_MODAL);
export const openNewCategoryModal = createAction(OPEN_NEW_CATEGORY_MODAL);
export const closeNewCategoryModal = createAction(CLOSE_NEW_CATEGORY_MODAL);
export const openEditFeedOrCategoryModal = createAction(OPEN_EDIT_FEED_OR_CATEGORY_MODAL);
export const closeEditFeedOrCategoryModal = createAction(CLOSE_EDIT_FEED_OR_CATEGORY_MODAL);
export const openEntryContentModal = createAction(OPEN_ENTRY_CONTENT_MODAL);
export const closeEntryContentModal = createAction(CLOSE_ENTRY_CONTENT_MODAL);

const initial = {
  newFeedModalIsOpen: false,
  entryContentModalIsOpen: false,
  newCategoryModalIsOpen: false,
  editFeedOrCategoryModalIsOpen: false
};

export default function reducer(state = initial, action) {
  switch (action.type) {
  case OPEN_NEW_FEED_MODAL:
    return { ...state, newFeedModalIsOpen: true };
  case CLOSE_NEW_FEED_MODAL:
    return { ...state, newFeedModalIsOpen: false };
  case OPEN_NEW_CATEGORY_MODAL:
    return { ...state, newCategoryModalIsOpen: true };
  case CLOSE_NEW_CATEGORY_MODAL:
    return { ...state, newCategoryModalIsOpen: false };
  case OPEN_EDIT_FEED_OR_CATEGORY_MODAL:
    return { ...state, editFeedOrCategoryModalIsOpen: true };
  case CLOSE_EDIT_FEED_OR_CATEGORY_MODAL:
    return { ...state, editFeedOrCategoryModalIsOpen: false };
  case OPEN_ENTRY_CONTENT_MODAL:
    return { ...state, entryContentModalIsOpen: true };
  case CLOSE_ENTRY_CONTENT_MODAL:
    return { ...state, entryContentModalIsOpen: false };
  default:
    return state;
  }
}
