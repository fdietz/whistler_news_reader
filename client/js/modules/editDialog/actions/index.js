import { createAction } from 'redux-actions';

export const EDIT_FORM_UPDATE = 'EDIT_FORM_UPDATE';
export const EDIT_FORM_RESET = 'EDIT_FORM_RESET';

export const editFormUpdate = createAction(EDIT_FORM_UPDATE);
export const editFormReset = createAction(EDIT_FORM_RESET);
