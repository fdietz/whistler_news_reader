import React, { Component, PropTypes } from "react";

export default class LayoutPane extends Component {

  static PropTypes = {
    children: PropTypes.node.required,
    size: PropTypes.number.required
  };

  render() {
    const cls = `layout-master-pane layout-master-pane-size-${this.props.size}`;
    
    return (
      <div className={cls}>
        {this.props.children}
      </div>
    );
  }
}
