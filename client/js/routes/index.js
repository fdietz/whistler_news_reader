import user from '../modules/user';
import main from '../modules/main';
import sidebar from '../modules/sidebar';

import entryList from '../modules/entryList';
import entryDetail from '../modules/entryDetail';

import editDialog from '../modules/editDialog';
import newFeedDialog from '../modules/newFeedDialog';
import newCategoryDialog from '../modules/newCategoryDialog';
import opmlImportDialog from '../modules/opmlImportDialog';

import patterns from '../modules/patterns';

const entryListRoute = {
  path: 'entries',
  component: entryList.container,
  childRoutes: [
    {
      path: ':id',
      component: entryDetail.container,
    }
  ]
};

const editDialogRoute = {
  path: 'edit',
  component: editDialog.container,
};

const opmlImportDialogRoutes = {
  path: 'opml_import',
  component: opmlImportDialog.container,
};

const newFeedDialogRoutes = {
  path: '/feeds/new',
  component: newFeedDialog.container,
};

const newCategoryDialogRoutes = {
  path: '/categories/new',
  component: newCategoryDialog.container,
};

export default function makeRoutes(store) {
  const routes = {
    childRoutes: [
      {
        path: '/sign_in',
        component: user.SignIn
      },
      {
        path: '/sign_up',
        component: user.SignUp
      },
      {
        path: '/',
        component: user.AuthenticatedContainer,
        childRoutes: [
          {
            components: {
              sidebar: sidebar.container,
              mainApp: main.container
            },
            indexRoute: { onEnter: (nextState, replace) => replace('/today') },
            childRoutes: [
              newFeedDialogRoutes,
              newCategoryDialogRoutes,
              opmlImportDialogRoutes,
              {
                path: 'all',
                indexRoute: { onEnter: (nextState, replace) => replace('/all/entries') },
                childRoutes: [entryListRoute]
              },
              {
                path: 'today',
                indexRoute: { onEnter: (nextState, replace) => replace('/today/entries') },
                childRoutes: [entryListRoute]
              },
              {
                path: 'subscriptions/:subscription_id',
                indexRoute: {
                  onEnter: ({ params }, replace) =>
                    replace(`/subscriptions/${params.subscription_id}/entries`)
                },
                childRoutes: [entryListRoute, editDialogRoute]
              },
              {
                path: 'categories/:category_id',
                indexRoute: {
                  onEnter: ({ params }, replace) =>
                    replace(`/categories/${params.category_id}/entries`)
                },
                childRoutes: [entryListRoute, editDialogRoute]
              },
            ]
          }
        ]
      },
      {
        path: '/patterns',
        component: patterns.container
      }
    ]
  };

  return routes;
}
