import React, { Component, PropTypes } from "react";

export default class LayoutContent extends Component {

  static PropTypes = {
    children: PropTypes.node.required
  };

  render() {
    return (
      <div className="layout-master-content">
        {this.props.children}
      </div>
    );
  }
}
