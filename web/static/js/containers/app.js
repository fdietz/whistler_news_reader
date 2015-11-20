import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { createFeed, updateFeed, removeFeed, fetchEntries, fetchMoreEntries, fetchFeeds } from "../actions";

import MainHeader from "../components/MainHeader";
import FeedEntryList from "../components/FeedEntryList";
import Sidebar from "../components/Sidebar";

class App extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.array.isRequired,
    feeds: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchEntries());
    dispatch(fetchFeeds());
  }

  loadMore() {
    console.log("load more")
    const { dispatch, entries } = this.props;
    // TODO: fetch with pagination
    let oldestPublishedEntry = entries[entries.length-1].published;
    dispatch(fetchMoreEntries(oldestPublishedEntry));
  }

  render() {
    const { dispatch, entries, feeds, isLoading } = this.props;

    let buttonLabel = "Load More";
    if (isLoading) {
      buttonLabel = "loading...";
    }

    return (
      <div className="container">
        <MainHeader/>
        <Sidebar feeds={feeds}/>

        <div className="content with-sidebar">
          <MainHeader/>
          <FeedEntryList entries={entries}/>
          <div className="paginator">
            <button className="btn btn-primary" onClick={this.loadMore}>{buttonLabel}</button>
          </div>
        </div>

      </div>
    );
  }
}

function select(state) {
  return {
    entries: state.entries,
    feeds: state.feeds,
    isLoading: state.isLoading
  };
}

export default connect(select)(App);
