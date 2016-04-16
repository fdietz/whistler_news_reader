import { createAction } from "redux-actions";
import axios from "../../utils/APIHelper";

export const OPML_IMPORT_FORM_UPDATE = "OPML_IMPORT_FORM_UPDATE";
export const OPML_IMPORT_FORM_RESET = "OPML_IMPORT_FORM_RESET";

export const opmlImportFormUpdate = createAction(OPML_IMPORT_FORM_UPDATE);
export const opmlImportFormReset  = createAction(OPML_IMPORT_FORM_RESET);

export function requestOpmlImport(data) {
  return (dispatch) => {
    dispatch(opmlImportFormUpdate());

    return axios.post("/api/imports", data).
      then(response => {
        dispatch(opmlImportFormReset());
        return response.data;
      }).
      catch(response => {
        const formData = { errors: response.data.errors };
        dispatch(opmlImportFormUpdate(formData));
        return formData;
      });
  };
}

const initial = {
  file: null,
  isLoading: false,
  error: null
};

export default function reducer(state = initial, action) {
  if (action.type === OPML_IMPORT_FORM_UPDATE) {
    if (!action.payload) return {...state, isLoading: true };
    return { ...state, ...action.payload, isLoading: false };
  } else if (action.type === OPML_IMPORT_FORM_RESET) {
    return initial;
  }

  return state;
}
