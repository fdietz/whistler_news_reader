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

export const getSortedEntries = (state) => {
  return state.entries.listedIds.map(id => state.entries.byId[id]);
};
