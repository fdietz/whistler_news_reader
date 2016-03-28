import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { routeActions } from "react-router-redux";

import { requestSetCurrentUser } from "../redux/modules/user";
import { requestSignOut } from "../redux/modules/user";
import { requestFetchFeeds } from "../redux/modules/feeds";

import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";

import { requestRemoveFeed } from "../redux/modules/feeds";

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
    currentPath: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleOnRemove = this.handleOnRemove.bind(this);
    this.handleOnNextFeed = this.handleOnNextFeed.bind(this);
    this.handleOnPreviousFeed = this.handleOnPreviousFeed.bind(this);
  }

  handleSignOut() {
    const { dispatch } = this.props;
    dispatch(requestSignOut());
  }

  handleOnRemove(feed) {
    const { dispatch } = this.props;
    dispatch(requestRemoveFeed(feed.id));
  }

  handleOnNextFeed(path) {
    const { dispatch } = this.props;
    dispatch(routeActions.push(path));
  }

  handleOnPreviousFeed(path) {
    const { dispatch } = this.props;
    dispatch(routeActions.push(path));
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

    return (
      <div className="authenticated-container">
        <Sidebar
          feeds={feeds.items}
          currentPathname={currentPath}
          onRemoveClick={this.handleOnRemove}
          onSignOutClick={this.handleSignOut}
          onNextClick={this.handleOnNextFeed}
          onPreviousClick={this.handleOnPreviousFeed}/>

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
