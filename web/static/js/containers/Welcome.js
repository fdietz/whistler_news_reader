import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Welcome extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  render() {
    return (
      <div>
        <h2>Welcome</h2>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
