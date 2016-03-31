import { createSelector } from "reselect";

const getFeeds = (state) => state.feeds;

export const getSortedFeeds = createSelector(
  [getFeeds], (feeds) => {
    const sortedItems = feeds.items.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return {...feeds, items: sortedItems };
  }
);

const getCategories = (state) => state.categories;

export const getSortedCategories = createSelector(
  [getCategories], (categories) => {
    const sortedItems = categories.items.sort((a, b) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });

    return {...categories, items: sortedItems };
  }
);
