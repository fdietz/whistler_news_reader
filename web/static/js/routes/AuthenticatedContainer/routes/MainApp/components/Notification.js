import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Notification extends Component {

  static propTypes = {
    message: PropTypes.string,
    type: PropTypes.string,
  };

  render() {
    const { message, type } = this.props;
    const cls = classNames({
      notification: true,
      info: type === 'info',
      error: type === 'error',
      success: type === 'success',
    });

    return (
      <div className={cls}>
        {message}
      </div>
    );
  }
}
