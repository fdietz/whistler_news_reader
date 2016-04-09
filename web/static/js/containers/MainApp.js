import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import { routerActions } from "react-router-redux";
import classNames from "classnames";

import LayoutPane from "../components/LayoutPane";
import LayoutHeader from "../components/LayoutHeader";
import LayoutContent from "../components/LayoutContent";
import LayoutMasterSplit from "../components/LayoutMasterSplit";

import NewFeedDialog from "../containers/NewFeedDialog";
import EntryContentOverlay from "../containers/EntryContentOverlay";
import NewCategoryDialog from "../containers/NewCategoryDialog";
import EditDialog from "../containers/EditDialog";

import Button from "../components/Button";
import DropdownTrigger from "../components/DropdownTrigger";
import DropdownContent from "../components/DropdownContent";
import ButtonGroup from "../components/ButtonGroup";
import Dropdown from "../components/Dropdown";

import Icon from "../components/Icon";
import {
  CheckmarkSVGIcon,
  TrashSVGIcon,
  CycleSVGIcon,
  ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon,
  EarthSVGIcon,
  ResizeEnlargeSVGIcon,
  CogSVGIcon,
  ArrowDownSVGIcon,
  ArrowUpSVGIcon
} from "../components/SVGIcon";

import InfiniteScroll from "../components/InfiniteScroll";
import FeedEntryList from "../components/FeedEntryList";
import FeedEntryGrid from "../components/FeedEntryGrid";
import FeedEntryContent from "../components/FeedEntryContent";
import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";

import { getSortedFeeds, getSortedCategories } from "../redux/selectors";

import { bindHotKey, unbindHotKey } from "../utils/HotKeys";

import * as UserActions from "../redux/modules/user";
import * as EntriesActions from "../redux/modules/entries";
import * as FeedsActions from "../redux/modules/feeds";
import * as CategoriesActions from "../redux/modules/categories";
import * as CurrentEntryActions from "../redux/modules/currentEntry";
import * as CurrentSidebarSelectionActions from "../redux/modules/currentSidebarSelection";

class MainApp extends Component {

  static propTypes = {
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
    currentSidebarSelection: PropTypes.object.isRequired,

    // actions
    userActions: PropTypes.object.isRequired,
    feedsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    currentEntryActions: PropTypes.object.isRequired,
    currentSidebarSelectionActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newFeedModalIsOpen: false,
      entryContentOverlayIsOpen: false,
      addCategoryDialogIsOpen: false,
      editDialogIsOpen: false,
      currentViewLayout: "list"
    };

    this.loadMore = this.loadMore.bind(this);
    this.refreshEntries = this.refreshEntries.bind(this);
    this.openNewFeedModal = this.openNewFeedModal.bind(this);
    this.closeNewFeedModal = this.closeNewFeedModal.bind(this);
    this.handleEntryShown = this.handleEntryShown.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.closeEntryContentOverlay = this.closeEntryContentOverlay.bind(this);
    this.openExternal = this.openExternal.bind(this);

    this.nextEntry = debounce(this.nextEntry.bind(this), 100);
    this.previousEntry = debounce(this.previousEntry.bind(this), 100);
    this.openEntryEmbedSite = debounce(this.openEntryEmbedSite.bind(this), 100);

    this.handleOnRemove = this.handleOnRemove.bind(this);
    this.handleOnNextFeed = this.handleOnNextFeed.bind(this);
    this.handleOnPreviousFeed = this.handleOnPreviousFeed.bind(this);

    // used in sidebar
    // this.handleSignOut = this.handleSignOut.bind(this);
    this.handleOnCategoryExpandClick = this.handleOnCategoryExpandClick.bind(this);
    this.handleOnAddCategoryClick = this.handleOnAddCategoryClick.bind(this);
    this.handleOnFeedDrop = this.handleOnFeedDrop.bind(this);
    this.closeAddCategoryDialog = this.closeAddCategoryDialog.bind(this);

    this.openEditDialog = this.openEditDialog.bind(this);
    this.closeEditDialog = this.closeEditDialog.bind(this);

    this.handleViewLayoutChange = this.handleViewLayoutChange.bind(this);

    this.handleSelectCurrentEntry = this.handleSelectCurrentEntry.bind(this);
  }

  componentDidMount() {
    const {
      feedsActions,
      categoriesActions,
      currentSidebarSelectionActions,
      entriesActions
    } = this.props;

    feedsActions.requestFetchFeeds().then(() => {
      categoriesActions.requestFetchCategories().then(() => {
        currentSidebarSelectionActions(this.sidebarSelectionParams(this.props));
      });
    });

    entriesActions.requestFetchEntries(this.requestParams(this.props))
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
    const { currentSidebarSelectionActions, entriesActions } = this.props;

    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key) {
      currentSidebarSelectionActions.changeSidebarSelection(this.sidebarSelectionParams(nextProps));
      entriesActions.requestFetchEntries(this.requestParams(nextProps))
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
    const { entriesActions, entries } = this.props;
    if (entries.hasMoreEntries && !entries.isLoading) {
      let oldestPublishedEntry = entries.items[entries.items.length-1].published;
      let params = Object.assign(this.requestParams(this.props), {
        last_published: oldestPublishedEntry
      });
      entriesActions.requestFetchMoreEntries(params);
    }
  }

  refreshEntries() {
    const { entriesActions, feedsActions } = this.props;
    entriesActions.requestRefreshEntries(this.requestParams(this.props))
      .then(() => {
        feedsActions.requestFetchFeeds();
      });
  }

  nextEntry() {
    const { currentEntryActions, entries } = this.props;
    if (this.isNextEntry()) {
      const entry = entries.items[this.currentIndex()+1];
      currentEntryActions.selectEntry({ entry: entry });
    } else {
      this.loadMore().then(() => {
        this.nextEntry();
      });
    }
  }

  firstEntry() {
    const { currentEntryActions, entries } = this.props;
    if (entries.items.length > 0) {
      const entry = entries.items[0];
      currentEntryActions.selectEntry({ entry: entry });
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
    const { currentEntryActions, entries } = this.props;
    if (this.isPreviousEntry()) {
      const entry = entries.items[this.currentIndex()-1];
      currentEntryActions.selectEntry({ entry: entry });
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
    const { entriesActions, feedsActions } = this.props;
    entriesActions.requestMarkEntryAsRead(entry).then(() => {
      feedsActions.decrementUnreadCount({ id: entry.feed.id });
    });
  }

  markAsRead() {
    const { feedsActions, categoriesActions, entriesActions } = this.props;
    const params = this.requestParams(this.props);

    entriesActions.requestMarkAllEntriesAsRead(params).then(() => {
      if (params.feed_id === "all" || params.feed_id === "today") {
        feedsActions.requestFetchFeeds().then(() => {
          categoriesActions.requestFetchCategories();
        });
      } else if (params.feed_id) {
        feedsActions.resetUnreadCount({ id: +params.feed_id });
      } else if (params.category_id) {
        feedsActions.resetUnreadCount({ category_id: +params.category_id });
      }
    });
  }

  openEntryEmbedSite() {
    this.setState({ entryContentOverlayIsOpen: true });
  }

  closeEntryContentOverlay() {
    this.setState({ entryContentOverlayIsOpen: false });
  }

  openExternal() {
    window.open(this.props.currentEntry.url, "_blank");
  }

  handleOnRemove() {
    const { feedsActions, categoriesActions } = this.props;
    const params = this.requestParams(this.props);
    if (params.feed_id) {
      feedsActions.requeastRemoveFeed(+params.feed_id);
    } else if (params.category_id) {
      categoriesActions.requestRemoveCategory(+params.category_id);
    }
  }

  handleOnNextFeed(path) {
    routerActions.push(path);
  }

  handleOnPreviousFeed(path) {
    routerActions.push(path);
  }

  handleOnCategoryExpandClick(category, event) {
    event.preventDefault();
    const { categoriesActions } = this.props;
    categoriesActions.toggleExpandCategory({ id: category.id });
  }

  handleOnFeedDrop(feedId, categoryId) {
    const { categoriesActions } = this.props;
    categoriesActions.requestUpdateFeedCategory(feedId, categoryId).then(() => {
      routerActions.push(`/feeds/${feedId}`);
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

  handleViewLayoutChange(value) {
    this.setState({ currentViewLayout: value });
  }

  handleSelectCurrentEntry(entry) {
    const { currentEntryActions } = this.props;
    const { currentViewLayout } = this.state;

    currentEntryActions.selectEntry({ entry: entry });
    if (currentViewLayout === "grid") {
      this.openEntryEmbedSite();
    }
  }

  render() {
    const { entries, categories, feeds, currentUser,
      currentEntry, currentPath, notification, userActions } = this.props;

    const { currentViewLayout } = this.state;

    const content = (
      <FeedEntryContent
        entry={currentEntry}
        onEntryShown={this.handleEntryShown}/>
    );

    let items;
    if (currentViewLayout === "list") {
      items = (<FeedEntryList
        entries={entries.items}
        currentEntry={currentEntry}
        onEntryClick={entry => this.handleSelectCurrentEntry(entry)}/>
      );
    } else if (currentViewLayout === "compact_list") {
      items = (<FeedEntryList
        entries={entries.items}
        currentEntry={currentEntry}
        onEntryClick={entry => this.handleSelectCurrentEntry(entry)}
        className="compact"/>
      );
    } else if (currentViewLayout === "grid") {
      items = (<FeedEntryGrid
        entries={entries.items}
        currentEntry={currentEntry}
        onEntryClick={entry => this.handleSelectCurrentEntry(entry)}/>
      );
    } else {
      throw Error(`Unknown currentViewLayout ${currentViewLayout}`);
    }

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
            <CheckmarkSVGIcon color="light-gray" size="small"/>
          </Button>
          <Button type="header" onClick={this.refreshEntries}>
            <CycleSVGIcon color="light-gray" size="small"/>
          </Button>
          <Button type="header" onClick={this.handleOnRemove}>
            <TrashSVGIcon color="light-gray" size="small"/>
          </Button>
        </ButtonGroup>
        <Dropdown className="ml1">
          <DropdownTrigger className="btn btn-header">
            <CogSVGIcon color="light-gray" size="small"/>
            <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down"/>
            <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up"/>
          </DropdownTrigger>
          <DropdownContent>
            <ul className="dropdown__list">
              <li
                className="dropdown__list-item"
                onClick={this.handleViewLayoutChange.bind(this, "list")}>
                  <input
                    type="radio"
                    id="list"
                    name="currrent_view_layout"
                    checked={currentViewLayout === "list"}
                    className="dropdown-field media"/>
                  <label
                    htmlFor="list"
                    className="dropdown-label content">List</label>
              </li>
              <li
                className="dropdown__list-item"
                onClick={this.handleViewLayoutChange.bind(this, "compact_list")}>
                  <input
                    type="radio"
                    id="compact_list"
                    name="currrent_view_layout"
                    checked={currentViewLayout === "compact_list"}
                    className="dropdown-field media"/>
                  <label
                    htmlFor="compact_list"
                    className="dropdown-label
                    content">Compact List</label>
              </li>
              <li
                className="dropdown__list-item"
                onClick={this.handleViewLayoutChange.bind(this, "grid")}>
                  <input
                    type="radio"
                    id="grid"
                    name="currrent_view_layout"
                    checked={currentViewLayout === "grid"}
                    className="dropdown-field media"/>
                  <label
                    htmlFor="grid"
                    className="dropdown-label content">Grid</label>
              </li>
              <li className="dropdown__list-separator"/>
              <li
                className="dropdown__list-item"
                onClick={this.openEditDialog}>
                <div className="media"/>
                <div className="content">Settings</div>
              </li>
            </ul>
          </DropdownContent>
        </Dropdown>
        {currentViewLayout === "grid" &&
          <ButtonGroup className="btn-group-rounded ml2">
            <Button type="header" onClick={this.previousEntry}>
              <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
            </Button>
            <Button type="header" onClick={this.nextEntry}>
              <ArrowRightBoldSVGIcon color="light-gray" size="small"/>
            </Button>
          </ButtonGroup>
        }
        {currentViewLayout === "grid" &&
          <ButtonGroup className="btn-group-rounded ml2">
            <Button type="header" onClick={this.openEntryEmbedSite}>
              <ResizeEnlargeSVGIcon color="light-gray" size="small"/>
            </Button>
            <Button type="header" onClick={this.openExternal}>
              <EarthSVGIcon color="light-gray" size="small"/>
            </Button>
          </ButtonGroup>
        }
        <span className={spinnerCls}>
          <Icon name="spinner" size="small"/>
        </span>
      </LayoutHeader>
    );

    const entryHeader = (
      <LayoutHeader>
        <ButtonGroup className="btn-group-rounded">
          <Button type="header" onClick={this.previousEntry}>
            <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
          </Button>
          <Button type="header" onClick={this.nextEntry}>
            <ArrowRightBoldSVGIcon color="light-gray" size="small"/>
          </Button>
        </ButtonGroup>
        <ButtonGroup className="btn-group-rounded ml2">
          <Button type="header" onClick={this.openEntryEmbedSite}>
            <ResizeEnlargeSVGIcon color="light-gray" size="small"/>
          </Button>
          <Button type="header" onClick={this.openExternal}>
            <EarthSVGIcon color="light-gray" size="small"/>
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
          userActions={userActions}
          onNextClick={this.handleOnNextFeed}
          onPreviousClick={this.handleOnPreviousFeed}
          onCategoryExpandClick={this.handleOnCategoryExpandClick}
          onAddCategoryClick={this.handleOnAddCategoryClick}
          onFeedDrop={this.handleOnFeedDrop}/>

          {currentViewLayout === "list" &&
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
          }
          {currentViewLayout === "compact_list" &&
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
          }
          {currentViewLayout === "grid" &&
            <LayoutMasterSplit>
              <LayoutPane size={100}>
                {listHeader}
                <LayoutContent>{paginatedItems}</LayoutContent>
              </LayoutPane>
            </LayoutMasterSplit>
          }

        {notification &&
          <Notification {...notification}/>
        }

        {this.state.newFeedModalIsOpen &&
          <NewFeedDialog
            isOpen={this.state.newFeedModalIsOpen}
            onClose={this.closeNewFeedModal}/>
        }

        {this.state.entryContentOverlayIsOpen &&
          <EntryContentOverlay
            isOpen={this.state.entryContentOverlayIsOpen}
            onClose={this.closeEntryContentOverlay}
            onPreviousClick={this.previousEntry}
            onNextClick={this.nextEntry}
            onOpenExternalClick={this.openExternal}/>
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

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    entriesActions: bindActionCreators(EntriesActions, dispatch),
    feedsActions: bindActionCreators(FeedsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    currentEntryActions: bindActionCreators(CurrentEntryActions, dispatch),
    currentSidebarSelectionActions: bindActionCreators(CurrentSidebarSelectionActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
