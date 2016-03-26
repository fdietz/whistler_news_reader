import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";

import LayoutPane from "../components/LayoutPane";
import LayoutHeader from "../components/LayoutHeader";
import LayoutContent from "../components/LayoutContent";
import LayoutMasterSplit from "../components/LayoutMasterSplit";

import NewFeedForm from "../containers/NewFeedForm";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Icon from "../components/Icon";

import InfiniteScroll from "../components/InfiniteScroll";
import FeedEntryList from "../components/FeedEntryList";
import FeedEntryContent from "../components/FeedEntryContent";

import {
  requestFetchEntries,
  requestFetchMoreEntries,
  requestRefreshEntries,
  requestMarkEntryAsRead,
  requestMarkAllFeedEntriesAsRead
} from "../redux/modules/entries";

import { decrementUnreadCount, resetUnreadCount } from "../redux/modules/feeds";
import { selectEntry } from "../redux/modules/currentEntry";

class Entries extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    createFeed: PropTypes.object,
    currentEntry: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newFeedModalIsOpen: false,
      feedUrl: ""
    };

    this.loadMore = this.loadMore.bind(this);
    this.refreshEntries = this.refreshEntries.bind(this);
    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);
    this.openNewFeedModal = this.openNewFeedModal.bind(this);
    this.closeNewFeedModal = this.closeNewFeedModal.bind(this);
    this.handleEntryShown = this.handleEntryShown.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
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
    }

    return {};
  }

  loadMore() {
    const { dispatch, entries } = this.props;
    if (entries.hasMoreEntries && !entries.isLoading) {
      let oldestPublishedEntry = entries.items[entries.items.length-1].published;
      let params = Object.assign(this.requestParams(this.props), {
        last_published: oldestPublishedEntry
      });
      dispatch(requestFetchMoreEntries(params));
    }
  }

  refreshEntries() {
    const { dispatch } = this.props;
    dispatch(requestRefreshEntries(this.requestParams(this.props)));
  }

  nextEntry() {
    const { dispatch, entries } = this.props;
    if (this.isNextEntry()) {
      const entry = entries.items[this.currentIndex()+1];
      dispatch(selectEntry({ entry: entry }));
    } else {
      this.loadMore().then(() => {
        this.nextEntry();
      });
    }
  }

  isNextEntry() {
    const { entries } = this.props;
    return this.currentIndex()+1 < entries.items.length;
  }

  currentIndex() {
    const { entries, currentEntry } = this.props;
    return currentEntry ? entries.items.indexOf(currentEntry) : 0;
  }

  previousEntry() {
    const { dispatch, entries } = this.props;
    if (this.isPreviousEntry()) {
      const entry = entries.items[this.currentIndex()-1];
      dispatch(selectEntry({ entry: entry }));
    }
  }

  isPreviousEntry() {
    return this.currentIndex()-1 >= 0;
  }

  openNewFeedModal() {
    this.setState({ newFeedModalIsOpen: true });
  }

  closeNewFeedModal() {
    this.setState({ newFeedModalIsOpen: false });
  }

  handleEntryShown(entry) {
    const { dispatch} = this.props;
    dispatch(requestMarkEntryAsRead(entry));
    dispatch(decrementUnreadCount({ id: entry.feed.id }));
  }

  markAsRead() {
    const { dispatch} = this.props;
    const params = this.requestParams(this.props);

    if (params.feed_id) {
      dispatch(requestMarkAllFeedEntriesAsRead(+params.feed_id));
      dispatch(resetUnreadCount({ id: +params.feed_id }));
    }
  }

  render() {
    const { dispatch, entries, currentEntry } = this.props;

    const content = (
      <FeedEntryContent
        entry={currentEntry}
        onEntryShown={this.handleEntryShown}/>
    );

    const items = (<FeedEntryList
      entries={entries.items}
      currentEntry={currentEntry}
      onEntryClick={entry => dispatch(selectEntry({ entry: entry })) }/>
    );

    const noMoreContent = (
      <div className="item no-more-content">
        <p className="hint">No more contents. You are all done!</p>
        <div className="smile">:-)</div>
      </div>
    );

    const paginatedItems = (<InfiniteScroll
      threshold={300}
      loadMore={this.loadMore}
      hasMore={entries.hasMoreEntries}>
      {entries.items.length > 0 && items}
      {!entries.hasMoreEntries && noMoreContent}
    </InfiniteScroll>);

    const listHeader = (
      <LayoutHeader>
        <ButtonGroup className="btn-group-rounded">
          <Button type="btn-header" onClick={this.markAsRead}>
            <Icon name="checkmark" size="small"/>
          </Button>
          <Button type="btn-header" onClick={this.refreshEntries}>
            <Icon name="cycle" size="small"/>
          </Button>
        </ButtonGroup>
      </LayoutHeader>
    );

    const entryHeader = (
      <LayoutHeader>
        <ButtonGroup className="btn-group-rounded">
          <Button type="btn-header" onClick={this.previousEntry}>
            <Icon name="arrow-left3" size="small"/>
          </Button>
          <Button type="btn-header" onClick={this.nextEntry}>
            <Icon name="arrow-right3" size="small"/>
          </Button>
        </ButtonGroup>
        <ButtonGroup className="mx-l-auto">
          <Button type="btn btn-primary" onClick={this.openNewFeedModal}>
            + Add Feed
          </Button>
        </ButtonGroup>
      </LayoutHeader>
    );

    return (
      <LayoutMasterSplit>
        <LayoutPane size={30}>
          {listHeader}
          <LayoutContent>{paginatedItems}</LayoutContent>
        </LayoutPane>
        <LayoutPane size={70}>
          {entryHeader}
          <LayoutContent>{currentEntry && content}</LayoutContent>
        </LayoutPane>

        <NewFeedForm
          isOpen={this.state.newFeedModalIsOpen}
          closeNewFeedModal={this.closeNewFeedModal}/>
      </LayoutMasterSplit>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    entries: state.entries,
    currentEntry: state.currentEntry,
    location: ownProps.location
  };
}

export default connect(mapStateToProps)(Entries);
