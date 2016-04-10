import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

class RootLayout extends Component {

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className="root-layout">
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
  };
}

export default connect(mapStateToProps)(RootLayout);
