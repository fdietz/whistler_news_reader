export default {
  getToken: () => {
    if (window.localStorage) {
      return localStorage.getItem("phoenixAuthToken");
    }

    return null;
  }
};
