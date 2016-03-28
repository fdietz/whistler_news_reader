import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { routeActions } from "react-router-redux";

import { requestSetCurrentUser } from "../redux/modules/user";

class AuthenticatedContainer extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (localStorage.getItem("phoenixAuthToken")) {
      if (!currentUser) dispatch(requestSetCurrentUser());
    } else {
      dispatch(routeActions.push("/sign_up"));
    }
  }

  render() {
    if (!this.props.currentUser) return false;

    return (
      <div className="authenticated-container">
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.current
});

export default connect(mapStateToProps)(AuthenticatedContainer);
