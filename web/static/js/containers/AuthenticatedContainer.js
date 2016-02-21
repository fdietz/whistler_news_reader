import React, { Component, PropTypes } from "react";
import { connect }  from "react-redux";
import { routeActions } from "react-router-redux";

import { requestSetCurrentUser } from "../redux/modules/user";
import { requestSignOut } from "../redux/modules/user";
import Header from "../components/Header";

class AuthenticatedContainer extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut(e) {
    const { dispatch } = this.props;

    dispatch(requestSignOut());
  }

  componentDidMount() {
    console.log("authenticated-container")
    const { dispatch, currentUser } = this.props;

    if (localStorage.getItem("phoenixAuthToken")) {
      if (!currentUser) dispatch(requestSetCurrentUser());
    } else {
      dispatch(routeActions.push("/sign_up"));
    }
  }

  render() {
    const { currentUser } = this.props;

    console.log("authenticated-container render 0")
    if (!currentUser) return false;

    console.log("authenticated-container render 1")
    
    return (
      <div className="authenticated-container">
        <Header currentUser={currentUser} onSignOutClick={this.handleSignOut}></Header>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.current
});

export default connect(mapStateToProps)(AuthenticatedContainer);
