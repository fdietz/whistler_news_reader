import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';

import Sidebar from '../components/Sidebar';
import Notification from '../components/Notification';
import ModalWrapper from '../components/ModalWrapper';

import * as SubscriptionsActions from '../redux/modules/subscriptions';
import * as CategoriesActions from '../redux/modules/categories';
import * as SidebarActions from '../redux/modules/sidebar';

import { getSortedSubscriptions, getSortedCategories } from '../redux/selectors';

import shallowCompare from 'react-addons-shallow-compare';
import { mapRequestParams } from '../utils/navigator';

class MainAppContainer extends Component {

  static propTypes = {
    sortedSubscriptions: PropTypes.array.isRequired,
    subscriptions: PropTypes.object.isRequired,
    sortedCategories: PropTypes.array.isRequired,
    pathname: PropTypes.string.isRequired,
    notification: PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
    sidebar: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.node,

    // actions
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { subscriptionsActions, categoriesActions } = this.props;

    Promise.all([
      subscriptionsActions.requestFetchSubscriptions(),
      categoriesActions.requestFetchCategories(),
    ]);
  }

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal
    )) {
      // save the old children (just like animation)
      this.previousPathname = this.props.location.pathname;
      this.previousChildren = this.props.children;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  requestParams(props) {
    const { params, pathname } = props;
    return mapRequestParams(params, pathname);
  }

  render() {
    const {
      sortedCategories,
      sortedSubscriptions,
      pathname,
      notification,
      location,
      sidebar,
    } = this.props;

    const { categoriesActions, subscriptionsActions, routerActions, sidebarActions } = this.props;

    const isModal = (location.state && location.state.modal && this.previousChildren);

    return (
      <div className="main-app-container">

        <Sidebar
          sidebar={sidebar}
          subscriptions={sortedSubscriptions}
          categories={sortedCategories}
          currentPathname={pathname}
          subscriptionsActions={subscriptionsActions}
          categoriesActions={categoriesActions}
          sidebarActions={sidebarActions}
          routerActions={routerActions}
    />

        {isModal
          ? this.previousChildren
          : this.props.children
        }

        {isModal && (
          <ModalWrapper
            returnTo={this.previousPathname || location.pathname}
            routerActions={routerActions}
    >
            {this.props.children}
          </ModalWrapper>
        )}

        {notification &&
          <Notification {...notification} />
        }

      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    subscriptions: state.subscriptions,
    sortedSubscriptions: getSortedSubscriptions(state),
    sortedCategories: getSortedCategories(state),
    location: ownProps.location,
    pathname: ownProps.location.pathname,
    notification: state.notification,
    sidebar: state.sidebar,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    routerActions: bindActionCreators(RouterActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MainAppContainer);
