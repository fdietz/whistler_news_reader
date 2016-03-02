import React, { Component, PropTypes } from "react";

export default class Button extends Component {

  static propTypes = {
    children: PropTypes.node,
    type: PropTypes.string,
    onClick: PropTypes.func
  };

  render() {
    const { type, onClick, children } = this.props;
    const cls = `btn ${type}`;

    return (
      <button onClick={onClick} className={cls}>
        {children}
      </button>
    );
  }
}
