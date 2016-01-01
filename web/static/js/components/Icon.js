import React, { Component, PropTypes } from "react";

export default class Icon extends Component {

  static PropTypes = {
    children: PropTypes.node.required,
    name: PropTypes.string.required,
    size: PropTypes.number
  };

  render() {
    const iconClassName = `svg-entypo-icon-${this.props.name}`;
    const iconClassSize = `svg-icon-${this.props.size}`;
    const cls = `${iconClassName} ${iconClassSize}`;

    return (
      <span className={cls}>
        {this.props.children}
      </span>
    );
  }
}
