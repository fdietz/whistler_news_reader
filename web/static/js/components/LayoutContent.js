import React, { Component, PropTypes } from "react";

export default class LayoutContent extends Component {

  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return (
      <div className="layout-master-content">
        {this.props.children}
      </div>
    );
  }
}
