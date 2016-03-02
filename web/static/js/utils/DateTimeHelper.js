export default {
  timeDifference: (previous) => {
    const current = new Date();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + "sec";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + "m";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed/msPerHour) + "h";
    } else if (elapsed < msPerMonth) {
      return (previous.getMonth()+1) + "/" + previous.getDay() + "/" + previous.getFullYear();
    }
  }
};
