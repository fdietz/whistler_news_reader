import MainAppContainer from './containers/MainAppContainer';

import NewFeedDialog from './routes/NewFeedDialog';
import NewCategoryDialog from './routes/NewCategoryDialog';
import EditDialog from './routes/EditDialog';
import OpmlImportDialog from './routes/OpmlImportDialog';
import EntryList from './routes/EntryList';

const routes = {
  component: MainAppContainer,
  indexRoute: { onEnter: (nextState, replace) => replace('/today') },
  childRoutes: [
    NewFeedDialog,
    NewCategoryDialog,
    OpmlImportDialog,
    {
      path: 'all',
      indexRoute: { onEnter: (nextState, replace) => replace('/all/entries') },
      childRoutes: [EntryList]
    },
    {
      path: 'today',
      indexRoute: { onEnter: (nextState, replace) => replace('/today/entries') },
      childRoutes: [EntryList]
    },
    {
      path: 'subscriptions/:subscription_id',
      indexRoute: {
        onEnter: ({ params }, replace) =>
          replace(`/subscriptions/${params.subscription_id}/entries`)
      },
      childRoutes: [EntryList, EditDialog]
    },
    {
      path: 'categories/:category_id',
      indexRoute: {
        onEnter: ({ params }, replace) =>
          replace(`/categories/${params.category_id}/entries`)
      },
      childRoutes: [EntryList, EditDialog]
    },
  ]
};

export default routes;
