import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { pushState } from "redux-router";

import Sidebar from "../components/Sidebar";
import ModalWrapper from "../components/ModalWrapper";
import { requestFetchFeeds } from "../actions";

class Root extends Component {
  static propTypes = {
    feeds: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(requestFetchFeeds());
  }

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      (nextProps.location.state &&
      nextProps.location.state.modal) || (nextProps.children.props.route.modal)
    )) {
      // save the old children
      this.previousChildren = this.props.children;
    }
  }

  onAddFeedClick() {
    const { dispatch } = this.props;
    dispatch(pushState({ modal: true, returnTo: this.props.location.pathname }, "/feeds/new"));
  }

  render() {
    const { feeds, location, dispatch } = this.props;
    const returnTo = (location.state && location.state.returnTo) || "/"
    const isModal = this.props.children.props.route.modal || false;
    const currentPathname = location.pathname;

    return (
      <div className="layout-container2">
        <Sidebar feeds={feeds.items}
          currentPathname={currentPathname}
          onAddFeedClick={() => this.onAddFeedClick()}/>

          {isModal ?
            this.previousChildren :
            this.props.children
          }

          {isModal && (
            <ModalWrapper isOpen={true} returnTo={returnTo} dispatch={dispatch}>
              {this.props.children}
            </ModalWrapper>
          )}

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    feeds: state.feeds
  };
}

export default connect(mapStateToProps)(Root);
