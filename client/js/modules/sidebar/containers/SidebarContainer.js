import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';
import shallowCompare from 'react-addons-shallow-compare';

import Sidebar from '../components/Sidebar';

import * as SubscriptionsActions from '../../subscriptions/actions';
import * as CategoriesActions from '../../categories/actions';
import * as SidebarActions from '../actions';
import * as UserActions from '../../user/actions';

import { getSortedSubscriptions, getSortedCategories } from '../../../redux/selectors';


class SidebarContainer extends Component {

  static propTypes = {
    sortedSubscriptions: PropTypes.array.isRequired,
    sortedCategories: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
    sidebar: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.node,

    // actions
    userActions: PropTypes.object.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    sidebarActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { subscriptionsActions, categoriesActions } = this.props;

    Promise.all([
      subscriptionsActions.requestFetchSubscriptions(),
      categoriesActions.requestFetchCategories(),
    ]);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      sortedCategories,
      sortedSubscriptions,
      pathname,
      sidebar,
      currentUser
      } = this.props;

    const {
      categoriesActions,
      subscriptionsActions,
      routerActions,
      sidebarActions,
      userActions
      } = this.props;

    return (
      <Sidebar
        sidebar={sidebar}
        subscriptions={sortedSubscriptions}
        categories={sortedCategories}
        currentPathname={pathname}
        currentUser={currentUser}
        userActions={userActions}
        subscriptionsActions={subscriptionsActions}
        categoriesActions={categoriesActions}
        sidebarActions={sidebarActions}
        routerActions={routerActions} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    sortedSubscriptions: getSortedSubscriptions(state),
    sortedCategories: getSortedCategories(state),
    location: ownProps.location,
    pathname: ownProps.location.pathname,
    notification: state.notification,
    sidebar: state.sidebar,
    currentUser: state.user.current
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    routerActions: bindActionCreators(RouterActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarContainer);
