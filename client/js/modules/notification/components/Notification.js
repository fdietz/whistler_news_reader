import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class Notification extends Component {

  static propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string,
    isRetry: PropTypes.bool,
    onRetry: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    event.preventDefault();
    this.props.onRetry();
  }

  render() {
    const { message, type, isRetry } = this.props;
    if (!message) return null;

    const cls = classNames('notification', {
      info: type === 'info',
      error: type === 'error',
      success: type === 'success',
    });

    return (
      <div className={cls} onClick={this.onClick}>
        {message}
        {isRetry &&
          <a className="mx-l-auto">Retry</a>
        }
      </div>
    );
  }
}
