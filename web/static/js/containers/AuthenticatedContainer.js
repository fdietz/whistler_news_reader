import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { routeActions } from "react-router-redux";

import { requestSetCurrentUser } from "../redux/modules/user";
import { requestSignOut } from "../redux/modules/user";
import { requestFetchFeeds } from "../redux/modules/feeds";

import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";

class AuthenticatedContainer extends Component {

  static propTypes = {
    children: PropTypes.node,
    currentUser: PropTypes.object,
    feeds: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    notification: PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }),
    currentPath: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);

    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut() {
    const { dispatch } = this.props;
    dispatch(requestSignOut());
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;

    if (localStorage.getItem("phoenixAuthToken")) {
      if (!currentUser) dispatch(requestSetCurrentUser());
      dispatch(requestFetchFeeds());
    } else {
      dispatch(routeActions.push("/sign_up"));
    }
  }

  render() {
    const { currentUser, feeds, notification, currentPath } = this.props;
    if (!currentUser) return false;

    console.log("feeds", feeds)

    return (
      <div className="authenticated-container">
        <Sidebar feeds={feeds.items} currentPathname={currentPath}/>

        {notification &&
          <Notification {...notification}/>
        }

        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.user.current,
  feeds: state.feeds,
  notification: state.notification,
  currentPath: ownProps.location.pathname
});

export default connect(mapStateToProps)(AuthenticatedContainer);
