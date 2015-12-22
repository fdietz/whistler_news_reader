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
    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(requestFetchEntries(this.requestParams(this.props)));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key) {
      dispatch(requestFetchEntries(this.requestParams(nextProps)));
    }
  }

  requestParams(props) {
    if (props.params.id) {
      return { feed_id: props.params.id };
    } else if (props.location.pathname === "/all") {
      return { feed_id: "all" };
    } else if (props.location.pathname === "/today") {
      return { feed_id: "today" };
    } else {
      return {};
    }
  }

  loadMore() {
    const { dispatch, entries } = this.props;
    if (entries.hasMoreEntries && !entries.isLoading) {
      let oldestPublishedEntry = entries.items[entries.items.length-1].published;
      dispatch(requestFetchEntries(Object.assign(this.requestParams(this.props), { last_published: oldestPublishedEntry })));
    }
  }

  refreshEntries() {
    const { dispatch } = this.props;
    dispatch(requestRefreshEntries(this.requestParams(this.props)));
  }

  nextEntry() {
    const { dispatch, entries, currentEntry } = this.props;
    const currentIndex = entries.items.indexOf(currentEntry);
    if (currentIndex+1 < entries.items.length) {
      const entry = entries.items[currentIndex+1];
      dispatch(selectEntry({ entry: entry }));
    }
  }

  previousEntry() {
    const { dispatch, entries, currentEntry } = this.props;
    const currentIndex = entries.items.indexOf(currentEntry);
    if (currentIndex-1 >= 0) {
      const entry = entries.items[currentIndex-1];
      dispatch(selectEntry({ entry: entry }));
    }
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
      onEntryClick={entry => dispatch(selectEntry({ entry: entry })) }/>
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
            <div className="btn-group btn-group-rounded">
              <button className="btn btn-header">
                <span className="svg-entypo-icon-checkmark svg-icon-small"></span>
              </button>
              <button
                onClick={this.refreshEntries}
                className="btn btn-header">
                <span className="svg-entypo-icon-refresh svg-icon-small"></span>
              </button>
            </div>
          </div>
          <div className="layout-master-content">
            {paginatedItems}
          </div>
        </div>
        <div className="layout-master-right layout-master-60">
          <div className="layout-master-header px2">
            <div className="btn-group btn-group-rounded">
              <button
                onClick={this.previousEntry}
                className="btn btn-header">
                <span className="svg-entypo-icon-arrow-left3 svg-icon-small"></span>
              </button>
              <button
                onClick={this.nextEntry}
                className="btn btn-header">
                <span className="svg-entypo-icon-arrow-right3 svg-icon-small"></span>
              </button>
            </div>
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
