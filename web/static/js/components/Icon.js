import React, { Component, PropTypes } from "react";

export default class Icon extends Component {

  static propTypes = {
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    size: PropTypes.string
  };

  render() {
    const { name, children } = this.props;

    let size = this.props.size || "medium";
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
