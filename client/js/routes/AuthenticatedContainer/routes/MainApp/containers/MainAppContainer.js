import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';

import Notification from '../components/Notification';
import ModalWrapper from '../components/ModalWrapper';

import shallowCompare from 'react-addons-shallow-compare';

class MainAppContainer extends Component {

  static propTypes = {
    pathname: PropTypes.string.isRequired,
    notification: PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
    location: PropTypes.object.isRequired,
    children: PropTypes.node,

    // actions
    routerActions: PropTypes.object.isRequired,
  };

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

  render() {
    const { notification, location } = this.props;
    const { routerActions } = this.props;
    const isModal = (location.state && location.state.modal && this.previousChildren);

    return (
      <div className="main-app-container">

        {isModal ? this.previousChildren : this.props.children}

        {isModal && (
          <ModalWrapper
            returnTo={this.previousPathname || location.pathname}
            routerActions={routerActions}>
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
    location: ownProps.location,
    pathname: ownProps.location.pathname,
    notification: state.notification
  };
}

function mapDispatchToProps(dispatch) {
  return {
    routerActions: bindActionCreators(RouterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainAppContainer);
