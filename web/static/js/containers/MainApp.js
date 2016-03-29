import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import { routeActions } from "react-router-redux";

import LayoutPane from "../components/LayoutPane";
import LayoutHeader from "../components/LayoutHeader";
import LayoutContent from "../components/LayoutContent";
import LayoutMasterSplit from "../components/LayoutMasterSplit";

import NewFeedForm from "../containers/NewFeedForm";
import EntryEmbedSite from "../containers/EntryEmbedSite";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Icon from "../components/Icon";

import InfiniteScroll from "../components/InfiniteScroll";
import FeedEntryList from "../components/FeedEntryList";
import FeedEntryContent from "../components/FeedEntryContent";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";


import { bindHotKey, unbindHotKey } from "../utils/HotKeys";

import {
  requestFetchEntries,
  requestFetchMoreEntries,
  requestRefreshEntries,
  requestMarkEntryAsRead,
  requestMarkAllFeedEntriesAsRead
} from "../redux/modules/entries";

import {
  decrementUnreadCount,
  resetUnreadCount,
  requestFetchFeeds,
  requestRemoveFeed
} from "../redux/modules/feeds";

import { requestSignOut } from "../redux/modules/user";
import { selectEntry } from "../redux/modules/currentEntry";

class MainApp extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    feeds: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    currentEntry: PropTypes.object,
    currentUser: PropTypes.object,
    currentPath: PropTypes.string.isRequired,
    notification: PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }),
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newFeedModalIsOpen: false,
      entryEmbedSiteIsOpen: false
    };

    this.loadMore = this.loadMore.bind(this);
    this.refreshEntries = this.refreshEntries.bind(this);
    this.openNewFeedModal = this.openNewFeedModal.bind(this);
    this.closeNewFeedModal = this.closeNewFeedModal.bind(this);
    this.handleEntryShown = this.handleEntryShown.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.closeEntryEmbedSite = this.closeEntryEmbedSite.bind(this);
    this.openExternal = this.openExternal.bind(this);

    this.nextEntry = debounce(this.nextEntry.bind(this), 100);
    this.previousEntry = debounce(this.previousEntry.bind(this), 100);
    this.openEntryEmbedSite = debounce(this.openEntryEmbedSite.bind(this), 100);

    this.handleOnRemove = this.handleOnRemove.bind(this);
    this.handleOnNextFeed = this.handleOnNextFeed.bind(this);
    this.handleOnPreviousFeed = this.handleOnPreviousFeed.bind(this);

    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(requestFetchFeeds());
    dispatch(requestFetchEntries(this.requestParams(this.props)))
    .then(() => {
      this.firstEntry();
    });

    bindHotKey("nextEntry", () => this.nextEntry());
    bindHotKey("previousEntry", () => this.previousEntry());
    bindHotKey("openEntry", () => this.openEntryEmbedSite());
  }

  componentWillUnmount() {
    unbindHotKey("nextEntry");
    unbindHotKey("previousEntry");
    unbindHotKey("openEntry");
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key) {
      dispatch(requestFetchEntries(this.requestParams(nextProps)))
      .then(() => {
        this.firstEntry();
      });
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
    dispatch(requestRefreshEntries(this.requestParams(this.props)))
      .then(() => {
        dispatch(requestFetchFeeds());
      });
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

  firstEntry() {
    const { dispatch, entries } = this.props;
    if (entries.items.length > 0) {
      const entry = entries.items[0];
      dispatch(selectEntry({ entry: entry }));
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
    dispatch(requestMarkEntryAsRead(entry)).then(() => {
      dispatch(decrementUnreadCount({ id: entry.feed.id }));
    });
  }

  markAsRead() {
    const { dispatch} = this.props;
    const params = this.requestParams(this.props);

    if (params.feed_id) {
      dispatch(requestMarkAllFeedEntriesAsRead(+params.feed_id)).then(() => {
        dispatch(resetUnreadCount({ id: +params.feed_id }));
      });
    }
  }

  openEntryEmbedSite() {
    this.setState({ entryEmbedSiteIsOpen: true });
  }

  closeEntryEmbedSite() {
    this.setState({ entryEmbedSiteIsOpen: false });
  }

  openExternal() {
    window.open(this.props.currentEntry.url, "_blank");
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

  render() {
    const { dispatch, entries, feeds, currentUser, currentEntry, currentPath, notification } = this.props;

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
        <ButtonGroup className="btn-group-rounded ml2">
          <Button type="btn-header" onClick={this.openEntryEmbedSite}>
            <Icon name="resize-enlarge" size="small"/>
          </Button>
          <Button type="btn-header" onClick={this.openExternal}>
            <Icon name="earth" size="small"/>
          </Button>
        </ButtonGroup>
      </LayoutHeader>
    );

    return (
      <div className="main-app-container">

        <Sidebar
          feeds={feeds.items}
          currentPathname={currentPath}
          currentUser={currentUser}
          onAddClick={this.openNewFeedModal}
          onRemoveClick={this.handleOnRemove}
          onSignOutClick={this.handleSignOut}
          onNextClick={this.handleOnNextFeed}
          onPreviousClick={this.handleOnPreviousFeed}/>

        <LayoutMasterSplit>
          <LayoutPane size={30}>
            {listHeader}
            <LayoutContent>{paginatedItems}</LayoutContent>
          </LayoutPane>
          <LayoutPane size={70}>
            {entryHeader}
            <LayoutContent>{currentEntry && content}</LayoutContent>
          </LayoutPane>

        </LayoutMasterSplit>

        {notification &&
          <Notification {...notification}/>
        }

        {this.state.newFeedModalIsOpen &&
          <NewFeedForm
            isOpen={this.state.newFeedModalIsOpen}
            closeNewFeedModal={this.closeNewFeedModal}/>
        }

        {this.state.entryEmbedSiteIsOpen &&
          <EntryEmbedSite
            isOpen={this.state.entryEmbedSiteIsOpen}
            onClose={this.closeEntryEmbedSite}/>
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentUser: state.user.current,
    feeds: state.feeds,
    entries: state.entries,
    currentEntry: state.currentEntry,
    location: ownProps.location,
    currentPath: ownProps.location.pathname,
    notification: state.notification
  };
}

export default connect(mapStateToProps)(MainApp);
