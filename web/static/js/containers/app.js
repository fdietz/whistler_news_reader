import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { pushState } from "redux-router";

import Sidebar from "../components/Sidebar";
import ModalWrapper from "../components/ModalWrapper";
import { fetchFeeds } from "../actions";

class App extends Component {
  static propTypes = {
    feeds: PropTypes.array.required,
    children: PropTypes.node
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchFeeds());
  }

  componentWillReceiveProps(nextProps) {
    // if we changed routes...
    if ((
      nextProps.location.key !== this.props.location.key &&
      nextProps.location.state &&
      nextProps.location.state.modal
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
    const isModal = (
      location.state &&
      location.state.modal &&
      this.previousChildren
    );

    return (
      <div className="layout-container">
        <Sidebar feeds={feeds} onAddFeedClick={() => this.onAddFeedClick()}/>

          {isModal ?
            this.previousChildren :
            this.props.children
          }

          {isModal && (
            <ModalWrapper isOpen={true} returnTo={location.state.returnTo} dispatch={dispatch}>
              {this.props.children}
            </ModalWrapper>
          )}

      </div>
    );
  }
}

export default connect((state) => ({ feeds: state.feeds }))(App);
