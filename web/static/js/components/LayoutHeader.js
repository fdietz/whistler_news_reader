import React, { Component, PropTypes } from "react";

export default class LayoutHeader extends Component {

  static propTypes = {
    children: PropTypes.node.required
  };

  render() {
    return (
      <div className="layout-master-header px2">
        {this.props.children}
      </div>
    );
  }
}
