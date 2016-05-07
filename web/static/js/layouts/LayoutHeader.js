import React, { Component, PropTypes } from 'react';

export default class LayoutHeader extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div className="layout-master-header">
        {this.props.children}
      </div>
    );
  }
}
