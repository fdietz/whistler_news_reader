import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Notification from '../components/Notification';

import * as notificationActions from '../actions';

export class NotificationContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    notification: PropTypes.shape({
      message: PropTypes.string,
      type: PropTypes.string,
      isRetry: PropTypes.bool,
      retryAction: PropTypes.func
    })
  };

  constructor(props) {
    super(props);

    this.onRetry = this.onRetry.bind(this);
  }

  onRetry() {
    const { retryAction } = this.props.notification;

    this.props.dispatch(notificationActions.resetNotification());
    if (retryAction) retryAction();
  }

  render() {
    const { message } = this.props.notification;

    if (message) {
      return <Notification {...this.props.notification} onRetry={this.onRetry} />;
    }

    return null;
  }
}

function mapStateToProps(state) {
  return {
    notification: state.notification
  };
}

export default connect(mapStateToProps)(NotificationContainer);
