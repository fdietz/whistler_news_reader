import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import { routeActions } from "react-router-redux";
import classNames from "classnames";

import LayoutPane from "../components/LayoutPane";
import LayoutHeader from "../components/LayoutHeader";
import LayoutContent from "../components/LayoutContent";
import LayoutMasterSplit from "../components/LayoutMasterSplit";

import NewFeedDialog from "../containers/NewFeedDialog";
import EntryEmbedSite from "../containers/EntryEmbedSite";
import NewCategoryDialog from "../containers/NewCategoryDialog";
import EditDialog from "../containers/EditDialog";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Icon from "../components/Icon";

import InfiniteScroll from "../components/InfiniteScroll";
import FeedEntryList from "../components/FeedEntryList";
import FeedEntryContent from "../components/FeedEntryContent";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";

import { getSortedFeeds, getSortedCategories } from "../redux/selectors";

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
  requestRemoveFeed,
  requestUpdateFeedCategory
} from "../redux/modules/feeds";

import {
  requestFetchCategories,
  toggleExpandCategory,
  requestRemoveCategory
} from "../redux/modules/categories";

import { requestSignOut } from "../redux/modules/user";
import { selectEntry } from "../redux/modules/currentEntry";
import { changeSidebarSelection } from "../redux/modules/currentSidebarSelection";

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
    categories: PropTypes.shape({
      items: PropTypes.array.isRequired
    }).isRequired,
    currentEntry: PropTypes.object,
    currentUser: PropTypes.object,
    currentPath: PropTypes.string.isRequired,
    notification: PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }),
    location: PropTypes.object.isRequired,
    currentSidebarSelection: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newFeedModalIsOpen: false,
      entryEmbedSiteIsOpen: false,
      addCategoryDialogIsOpen: false,
      editDialogIsOpen: false
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

    // used in sidebar
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleOnCategoryExpandClick = this.handleOnCategoryExpandClick.bind(this);
    this.handleOnAddCategoryClick = this.handleOnAddCategoryClick.bind(this);
    this.handleOnFeedDrop = this.handleOnFeedDrop.bind(this);
    this.closeAddCategoryDialog = this.closeAddCategoryDialog.bind(this);

    this.openEditDialog = this.openEditDialog.bind(this);
    this.closeEditDialog = this.closeEditDialog.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(requestFetchFeeds()).then(() => {
      dispatch(requestFetchCategories()).then(() => {
        dispatch(changeSidebarSelection(this.sidebarSelectionParams(this.props)));
      });
    });

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
      dispatch(changeSidebarSelection(this.sidebarSelectionParams(nextProps)));
      dispatch(requestFetchEntries(this.requestParams(nextProps)))
      .then(() => {
        this.firstEntry();
      });
    }
  }

  // TODO: simplify
  sidebarSelectionParams(props) {
    const { feeds, categories } = props;

    const params = this.requestParams(props);
    if (params.feed_id === "today" || params.feed_id === "all") {
      return {};
    } else if (params.feed_id) {
      return {
        selection: feeds.items.find((feed) => feed.id === +params.feed_id),
        isFeed: true
      };
    } else if (params.category_id) {
      return {
        selection: categories.items.find((category) => category.id === +params.category_id),
        isCategory: true
      };
    }

    return {};
  }

  // TODO: simplify
  requestParams(props) {
    if (props.params.id && props.location.pathname.startsWith("/feeds")) {
      return { feed_id: props.params.id };
    } else if (props.params.id && props.location.pathname.startsWith("/categories")) {
      return { category_id: props.params.id };
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
    return currentEntry ? entries.items.findIndex((entry) => entry.id === currentEntry.id) : 0;
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

  handleSignOut(event) {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(requestSignOut());
  }

  handleOnRemove() {
    const { dispatch } = this.props;
    const params = this.requestParams(this.props);
    if (params.feed_id) {
      dispatch(requestRemoveFeed(+params.feed_id));
    } else if (params.category_id) {
      dispatch(requestRemoveCategory(+params.category_id));
    }
  }

  handleOnNextFeed(path) {
    const { dispatch } = this.props;
    dispatch(routeActions.push(path));
  }

  handleOnPreviousFeed(path) {
    const { dispatch } = this.props;
    dispatch(routeActions.push(path));
  }

  handleOnCategoryExpandClick(category, event) {
    event.preventDefault();
    const { dispatch } = this.props;
    dispatch(toggleExpandCategory({ id: category.id }));
  }

  handleOnFeedDrop(feedId, categoryId) {
    const { dispatch } = this.props;
    dispatch(requestUpdateFeedCategory(feedId, categoryId)).then(() => {
      dispatch(routeActions.push(`/feeds/${feedId}`));
    });
  }

  handleOnAddCategoryClick(event) {
    event.preventDefault();
    this.setState({ addCategoryDialogIsOpen: true });
  }

  closeAddCategoryDialog() {
    this.setState({ addCategoryDialogIsOpen: false });
  }

  openEditDialog() {
    this.setState({ editDialogIsOpen: true });
  }

  closeEditDialog() {
    this.setState({ editDialogIsOpen: false });
  }

  render() {
    const {
      dispatch,
      entries,
      categories,
      feeds,
      currentUser,
      currentEntry,
      currentPath,
      notification
    } = this.props;

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

    const spinnerCls = classNames({
      spinner: true,
      hide: !entries.isLoading
    });

    const listHeader = (
      <LayoutHeader>
        <ButtonGroup className="btn-group-rounded">
          <Button type="header" onClick={this.markAsRead}>
            <Icon name="checkmark" size="small"/>
          </Button>
          <Button type="header" onClick={this.refreshEntries}>
            <Icon name="cycle" size="small"/>
          </Button>
          <Button type="header" onClick={this.handleOnRemove}>
            <Icon name="trash" size="small"/>
          </Button>
          <Button type="header" onClick={this.openEditDialog}>
            <Icon name="cog" size="small"/>
          </Button>
        </ButtonGroup>
        <span className={spinnerCls}>
          <Icon name="spinner" size="small"/>
        </span>
      </LayoutHeader>
    );

    const entryHeader = (
      <LayoutHeader>
        <ButtonGroup className="btn-group-rounded">
          <Button type="header" onClick={this.previousEntry}>
            <Icon name="arrow-left3" size="small"/>
          </Button>
          <Button type="header" onClick={this.nextEntry}>
            <Icon name="arrow-right3" size="small"/>
          </Button>
        </ButtonGroup>
        <ButtonGroup className="btn-group-rounded ml2">
          <Button type="header" onClick={this.openEntryEmbedSite}>
            <Icon name="resize-enlarge" size="small"/>
          </Button>
          <Button type="header" onClick={this.openExternal}>
            <Icon name="earth" size="small"/>
          </Button>
        </ButtonGroup>
      </LayoutHeader>
    );

    return (
      <div className="main-app-container">

        <Sidebar
          feeds={feeds.items}
          categories={categories.items}
          currentPathname={currentPath}
          currentUser={currentUser}
          onAddClick={this.openNewFeedModal}
          onSignOutClick={this.handleSignOut}
          onNextClick={this.handleOnNextFeed}
          onPreviousClick={this.handleOnPreviousFeed}
          onCategoryExpandClick={this.handleOnCategoryExpandClick}
          onAddCategoryClick={this.handleOnAddCategoryClick}
          onFeedDrop={this.handleOnFeedDrop}/>

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
          <NewFeedDialog
            isOpen={this.state.newFeedModalIsOpen}
            onClose={this.closeNewFeedModal}/>
        }

        {this.state.entryEmbedSiteIsOpen &&
          <EntryEmbedSite
            isOpen={this.state.entryEmbedSiteIsOpen}
            onClose={this.closeEntryEmbedSite}/>
        }

        {this.state.addCategoryDialogIsOpen &&
          <NewCategoryDialog
            isOpen={this.state.addCategoryDialogIsOpen}
            onClose={this.closeAddCategoryDialog}/>
        }

        {this.state.editDialogIsOpen &&
          <EditDialog
            isOpen={this.state.editDialogIsOpen}
            onClose={this.closeEditDialog}/>
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentUser: state.user.current,
    feeds: getSortedFeeds(state),
    entries: state.entries,
    categories: getSortedCategories(state),
    currentEntry: state.currentEntry,
    location: ownProps.location,
    currentPath: ownProps.location.pathname,
    notification: state.notification,
    currentSidebarSelection: state.currentSidebarSelection
  };
}

export default connect(mapStateToProps)(MainApp);
