import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { createFeed, updateFeed, removeFeed, fetchEntries, fetchMoreEntries, fetchFeeds } from "../actions";

import HalfWidthFeedEntryList from "../components/HalfWidthFeedEntryList";
import Sidebar from "../components/Sidebar";
import FeedEntryContent from "../components/FeedEntryContent";

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

    //  TODO: use state
    let currentEntry = entries[0];

    let buttonLabel = "Load More";
    if (isLoading) {
      buttonLabel = "loading...";
    }

    let content;
    if (currentEntry) {
      content = <FeedEntryContent entry={currentEntry}/>;
    }

    return (
      <div className="layout-container">
        <Sidebar feeds={feeds}/>

        <div className="layout-content with-sidebar">
          <div className="layout-list">
            <HalfWidthFeedEntryList entries={entries}/>
          </div>
          <div className="layout-detail">
            {content}
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
