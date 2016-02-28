import React, { Component, PropTypes } from "react";

export default class ButtonGroup extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  className() {
    return `btn-group btn-group-rounded ${this.props.className}`;
  }

  render() {
    return (
      <div className={this.className()}>
        {this.props.children}
      </div>
    );
  }
}
