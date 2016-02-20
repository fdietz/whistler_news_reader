import React, { Component, PropTypes } from "react";

export default class ButtonGroup extends Component {

  static PropTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="btn-group btn-group-rounded">
        {this.props.children}
      </div>
    );
  }
}
