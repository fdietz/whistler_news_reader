export default {
  getToken: () => {
    if (typeof window !== "undefined") {
      if (window.localStorage) {
        return localStorage.getItem("phoenixAuthToken");
      }
    }

    return null;
  }
};
