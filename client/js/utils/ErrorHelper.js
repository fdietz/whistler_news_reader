export const errorObjToString = (errorObj) =>
  Object.keys(errorObj)
    .reduce((result, key) => `${result}\n${key} ${errorObj[key]}`, '');

export const reduceErrorsToString = (errors) =>
  errors.map(errorObj => errorObjToString(errorObj));
