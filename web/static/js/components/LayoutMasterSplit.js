import React, { Component, PropTypes } from "react";

export default class LayoutMasterSplit extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="layout-master-split with-sidebar">
        {this.props.children}
      </div>
    );
  }
}
