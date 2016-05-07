import SignUp from './SignUp';
import SignIn from './SignIn';
import AuthenticatedContainer from './AuthenticatedContainer';

export default function makeRoutes(store) {
  const routes = {
    childRoutes: [
      SignUp,
      SignIn,
      AuthenticatedContainer
    ]
  };

  return routes;
}
