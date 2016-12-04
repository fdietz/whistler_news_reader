import { routerActions } from 'react-router-redux';

import * as subscriptionsActions from '../modules/subscriptions/actions';
import * as categoriesActions from '../modules/categories/actions';
import * as entriesActions from '../modules/entries/actions';

import { entryPath, mapRequestParams } from '../utils/navigator';

export function navigateToEntry(entryId, routeParams, pathname) {
  return dispatch => {
    dispatch(routerActions.push(entryPath(entryId, routeParams, pathname)));
  };
}

export function requestRemoveFeedOrCategory(routeParams, pathname) {
  return dispatch => {
    const mappedParams = mapRequestParams(routeParams, pathname);

    if (mappedParams.subscription_id) {
      dispatch(subscriptionsActions.requestRemoveSubscription(+mappedParams.subscription_id));
    } else if (mappedParams.category_id) {
      dispatch(categoriesActions.requestRemoveCategory(+mappedParams.category_id));
    }
  };
}

export function requestRefreshEntries(routeParams, pathname) {
  return dispatch => {
    dispatch(entriesActions.requestFetchEntries(mapRequestParams(routeParams, pathname)));
    dispatch(subscriptionsActions.requestFetchSubscriptions());
  };
}
