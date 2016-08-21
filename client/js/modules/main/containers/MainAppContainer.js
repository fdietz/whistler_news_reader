import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';
import shallowCompare from 'react-addons-shallow-compare';

import notification from '../../notification';
import ModalWrapper from '../components/ModalWrapper';

class MainAppContainer extends Component {

  static propTypes = {
    pathname: PropTypes.string.isRequired,
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
    const { location } = this.props;
    const { routerActions } = this.props;
    const isModal = (location.state && location.state.modal && this.previousChildren);
    const Notification = notification.container;

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
          <Notification />
        }

      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    location: ownProps.location,
    pathname: ownProps.location.pathname
  };
}

function mapDispatchToProps(dispatch) {
  return {
    routerActions: bindActionCreators(RouterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainAppContainer);
