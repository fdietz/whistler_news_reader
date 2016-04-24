import { createSelector } from "reselect";

const getFeeds = (state) => {
  return state.feeds.listedIds.map(id => state.feeds.byId[id]);
};

export const getSortedFeeds = createSelector(
  [getFeeds], (feeds) => {
    const sortedItems = feeds.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return sortedItems;
  }
);

const getSubscriptions = (state) => state.subscriptions;

const getSubscriptionsArray = (state) => {
  return state.subscriptions.listedIds.map(id => state.subscriptions.byId[id]);
};

export const getSortedSubscriptions = createSelector(
  [getSubscriptionsArray], (subscriptions) => {
    const sortedItems = subscriptions.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return sortedItems;
  }
);

const getCategories = (state) => {
  return state.categories.listedIds.map(id => state.categories.byId[id]);
};

export const getSortedCategories = createSelector(
  [getCategories], (categories) => {
    const sortedItems = categories.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return sortedItems;
  }
);

export const getEntries = (state) => {
  return state.entries.listedIds.map(id => state.entries.byId[id]);
};

export const getSortedEntries = createSelector(
  [getEntries, getSubscriptions], (entries, subscriptions) => {
    return entries.map(entry => {
      const subscription = subscriptions.byId[entry.subscription_id];
      return { ...entry, subscription_title: subscription.title };
    });
  }
);
