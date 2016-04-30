import React, { Component, PropTypes } from 'react';

export default class LayoutPane extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.number.isRequired,
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
