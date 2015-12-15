import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import InfiniteScroll from "../components/InfiniteScroll";
import HalfWidthFeedEntryList from "../components/HalfWidthFeedEntryList";
import FeedEntryContent from "../components/FeedEntryContent";

import imageProfile from "../../assets/images/profile.jpg";

import { requestFetchEntries, selectEntry } from "../actions";

class Entries extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    currentEntry: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    console.log("component did mount");

    const { dispatch } = this.props;
    dispatch(requestFetchEntries());
  }


  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key) {
      if (nextProps.params.id) {
        this.setState({ feed_id: nextProps.params.id });
        dispatch(requestFetchEntries({ feed_id: nextProps.params.id }));
      } else if (nextProps.location.pathname === "/all") {
        this.setState({ feed_id: "all" });
        dispatch(requestFetchEntries({ feed_id: "all" }));
      } else if (nextProps.location.pathname === "/today") {
        this.setState({ feed_id: "today" });
        dispatch(requestFetchEntries({ feed_id: "today" }));
      }
    }
  }

  loadMore() {
    const { dispatch, entries } = this.props;
    if (entries.hasMoreEntries && !entries.isLoading) {
      let oldestPublishedEntry = entries.items[entries.items.length-1].published;
      dispatch(requestFetchEntries(Object.assign({ feed_id: this.state.feed_id, last_published: oldestPublishedEntry })));
    }
  }

  render() {
    const { dispatch, entries, currentEntry } = this.props;

    let content;
    if (currentEntry) {
      content = <FeedEntryContent entry={currentEntry}/>;
    }

    let items = (<HalfWidthFeedEntryList
      entries={entries.items}
      currentEntry={currentEntry}
      onEntryClick={entry => dispatch(selectEntry(entry)) }/>
    );

    let paginatedItems;
    if (entries.items.length > 0) {
      paginatedItems = (<InfiniteScroll
        threshold={300}
        loadMore={this.loadMore}
        hasMore={entries.hasMoreEntries}
        className="scrollable-container"
        loader={<div className="loader">Loading ...</div>}>
        {items}
      </InfiniteScroll>);
    }

    return (
      <div className="layout-content with-sidebar">
        <div className="layout-list">
          <div className="list-header">
            <button className="btn btn--top-navigation">Mark as read</button>
            <button className="btn btn--top-navigation">Refresh</button>
          </div>

          {paginatedItems}
        </div>
        <div className="layout-detail">
          <div className="detail-header">
            <div className="left">
              <button className="btn btn--top-navigation">Prev</button>
              <button className="btn btn--top-navigation">Next</button>
            </div>
            <div className="right">
              <div className="avatar">
                <img src={imageProfile}/>
              </div>
            </div>

          </div>
          {content}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    entries: state.entries,
    currentEntry: state.currentEntry
  };
}

export default connect(mapStateToProps)(Entries);
