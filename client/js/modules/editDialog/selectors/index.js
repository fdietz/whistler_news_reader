export function isSubscriptionSelected(ownProps) {
  return ownProps.location.pathname.startsWith('/subscriptions');
}

export function isCategorySelected(ownProps) {
  return ownProps.location.pathname.startsWith('/categories');
}

export function selection(state, ownProps) {
  return isSubscriptionSelected(ownProps)
    ? state.subscriptions.byId[ownProps.params.subscription_id]
    : state.categories.byId[ownProps.params.category_id];
}
