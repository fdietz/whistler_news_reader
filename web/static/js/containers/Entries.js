import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";

import InfiniteScroll from "../components/InfiniteScroll";
import FeedEntryList from "../components/FeedEntryList";
import FeedEntryContent from "../components/FeedEntryContent";

import imageProfile from "../../assets/images/profile.jpg";

import { requestFetchEntries, requestRefreshEntries, selectEntry } from "../actions";

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
    this.refreshEntries = this.refreshEntries.bind(this);
  }

  componentDidMount() {
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

  refreshEntries() {
    const { dispatch } = this.props;
    dispatch(requestRefreshEntries({ feed_id: this.state.feed_id }));
  }

  render() {
    const { dispatch, entries, currentEntry } = this.props;

    let content;
    if (currentEntry) {
      content = (<FeedEntryContent entry={currentEntry}/>);
    }

    let items = (<FeedEntryList
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
        loader={<div className="loader">Loading ...</div>}>
        {items}
      </InfiniteScroll>);
    }

    return (
      <div className="layout-master-split with-sidebar">
        <div className="layout-master-left layout-master-40">
          <div className="layout-master-header px2">
            <button className="btn btn-primary bg-white gray">
              <span className="svg-icon-reload svg-icon-small"></span>
            </button>
            <button
              onClick={this.refreshEntries}
              className="btn btn-primary bg-white gray ml1">
              <span className="svg-icon-checkmark svg-icon-small"></span>
            </button>
          </div>
          <div className="layout-master-content">
            {paginatedItems}
          </div>
        </div>
        <div className="layout-master-right layout-master-60">
          <div className="layout-master-header px3">
            <button className="btn btn-primary bg-white gray">
              <span className="svg-icon-undo svg-icon-small"></span>
            </button>
            <button className="btn btn-primary bg-white gray ml1">
              <span className="svg-icon-redo svg-icon-small"></span>
            </button>
            <div className="avatar mx-l-auto">
              <img src={imageProfile}/>
            </div>
          </div>
          <div className="layout-master-content">
            {content}
          </div>
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
