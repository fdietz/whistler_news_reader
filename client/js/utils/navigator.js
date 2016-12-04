export function mapRequestParams(routeParams, pathname) {
  if (!pathname) throw new Error('Param missing pathname');

  if (routeParams.subscription_id && pathname.startsWith('/subscriptions')) {
    return { subscription_id: +routeParams.subscription_id };
  } else if (routeParams.category_id && pathname.startsWith('/categories')) {
    return { category_id: +routeParams.category_id };
  } else if (pathname.startsWith('/all')) {
    return { subscription_id: 'all' };
  } else if (pathname.startsWith('/today')) {
    return { subscription_id: 'today' };
  }

  throw new Error('unknown mapping for requestParams');
}

export function entryPath(entryId, currentParams, currentPathname) {
  const params = mapRequestParams(currentParams, currentPathname);

  if (params.subscription_id) {
    if (params.subscription_id === 'all') {
      return `/all/entries/${entryId}`;
    } else if (params.subscription_id === 'today') {
      return `/today/entries/${entryId}`;
    }

    return `/subscriptions/${params.subscription_id}/entries/${entryId}`;
  } else if (params.category_id) {
    return `/categories/${params.category_id}/entries/${entryId}`;
  }

  throw new Error('unknown mapping for entryPath');
}

export function configPathname(currentParams, currentPathname) {
  const params = mapRequestParams(currentParams, currentPathname);

  if (params.subscription_id) {
    return `/subscriptions/${params.subscription_id}/edit`;
  } else if (params.category_id) {
    return `/categories/${params.category_id}/edit`;
  }

  throw new Error('unknown mapping for configPathname');
}

export function goBackPathname(currentParams, currentPathname) {
  const params = mapRequestParams(currentParams, currentPathname);

  if (params.subscription_id) {
    if (params.subscription_id === 'all') {
      return '/all/entries';
    } else if (params.subscription_id === 'today') {
      return '/today/entries';
    }

    return `/subscriptions/${params.subscription_id}/entries`;
  } else if (params.category_id) {
    return `/categories/${params.category_id}/entries`;
  }

  throw new Error('unknown mapping for configPathname');
}
