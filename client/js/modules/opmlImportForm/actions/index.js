import { createAction } from 'redux-actions';
import axios from '../../../utils/APIHelper';

export const OPML_IMPORT_FORM_UPDATE = 'OPML_IMPORT_FORM_UPDATE';
export const OPML_IMPORT_FORM_RESET = 'OPML_IMPORT_FORM_RESET';

export const opmlImportFormUpdate = createAction(OPML_IMPORT_FORM_UPDATE);
export const opmlImportFormReset = createAction(OPML_IMPORT_FORM_RESET);

export function requestOpmlImport(data) {
  return (dispatch) => {
    dispatch(opmlImportFormUpdate());

    return axios.post('/api/imports', data)
      .then(response => {
        dispatch(opmlImportFormReset());
        return response.data;
      }, e => dispatch(opmlImportFormUpdate(e)));
  };
}
