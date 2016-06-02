export const errorObjToString = (errorObj) => {
  return Object.keys(errorObj)
    .reduce((result, key) => {
      return `${result}\n${key} ${errorObj[key]}`;
    }, '');
};

export const reduceErrorsToString = (errors) => {
  return errors.map(errorObj => errorObjToString(errorObj));
};
