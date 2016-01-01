import React, { Component, PropTypes } from "react";

export default class Icon extends Component {

  static PropTypes = {
    children: PropTypes.node.required,
    name: PropTypes.string.required,
    size: PropTypes.number
  };

  render() {
    const { name, size, children } = this.props;
    const iconClassName = `svg-entypo-icon-${name}`;
    const iconClassSize = `svg-icon-${size}`;
    const cls = `${iconClassName} ${iconClassSize}`;

    return (
      <span className={cls}>
        {children}
      </span>
    );
  }
}