import EntryListContainer from './containers/EntryListContainer';

import EntryDetail from './routes/EntryDetail';

const routes = {
  path: 'entries',
  component: EntryListContainer,
  childRoutes: [
    EntryDetail
  ]
};

export default routes;
