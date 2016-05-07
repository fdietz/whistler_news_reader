import AuthenticatedContainer from './containers/AuthenticatedContainer';
import MainApp from './routes/MainApp';

const routes = {
  path: '/',
  component: AuthenticatedContainer,
  childRoutes: [
    MainApp
  ]
};

export default routes;
