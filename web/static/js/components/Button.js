import React, { Component, PropTypes } from "react";

export default class Button extends Component {

  static PropTypes = {
    children: PropTypes.node.required,
    type: PropTypes.string.required,
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
