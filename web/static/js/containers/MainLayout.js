import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

class MainLayout extends Component {

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <div className="main-layout">
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
  };
}

export default connect(mapStateToProps)(MainLayout);
