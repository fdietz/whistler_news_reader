import React, { Component, PropTypes } from "react";
import InfiniteScroll from "../components/InfiniteScroll";
import { connect } from "react-redux";
import { createFeed, updateFeed, removeFeed, fetchEntries, fetchMoreEntries, selectEntry, fetchFeeds } from "../actions";

import HalfWidthFeedEntryList from "../components/HalfWidthFeedEntryList";
import Sidebar from "../components/Sidebar";
import FeedEntryContent from "../components/FeedEntryContent";

class App extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.array.isRequired,
    feeds: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentEntry: PropTypes.object.isRequired,
    hasMoreEntries: PropTypes.bool.isRequired
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
    const { dispatch, entries } = this.props;
    let oldestPublishedEntry = entries[entries.length-1].published;
    dispatch(fetchMoreEntries(oldestPublishedEntry));
  }

  render() {
    const { dispatch, entries, feeds, currentEntry, hasMoreEntries } = this.props;

    let content;
    if (currentEntry) {
      content = <FeedEntryContent entry={currentEntry}/>;
    }

    let items = (<HalfWidthFeedEntryList
      entries={entries}
      currentEntry={currentEntry}
      onEntryClick={entry => dispatch(selectEntry(entry)) }/>
    );

    let paginatedItems;
    if (entries.length > 0) {
      paginatedItems = (<InfiniteScroll
        threshold={300}
        loadMore={this.loadMore}
        hasMore={hasMoreEntries}
        loader={<div className="loader">Loading ...</div>}>
        {items}
      </InfiniteScroll>)
    }

    return (
      <div className="layout-container">
        <Sidebar feeds={feeds}/>

        <div className="layout-content with-sidebar">
          <div className="layout-list">
            {paginatedItems}
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
    currentEntry: state.currentEntry,
    hasMoreEntries: state.hasMoreEntries,
    feeds: state.feeds,
    isLoading: state.isLoading
  };
}

export default connect(select)(App);
