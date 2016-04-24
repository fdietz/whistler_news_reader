import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import debounce from "lodash.debounce";
import { routerActions } from "react-router-redux";

import Sidebar from "../components/Sidebar";
import Notification from "../components/Notification";
import MainAppViewLayout from "../components/MainAppViewLayout";

import NewFeedDialog from "../containers/NewFeedDialog";
import EntryContentOverlay from "../containers/EntryContentOverlay";
import NewCategoryDialog from "../containers/NewCategoryDialog";
import EditDialog from "../containers/EditDialog";
import OpmlImportDialog from "../containers/OpmlImportDialog";

import * as UserActions from "../redux/modules/user";
import * as EntriesActions from "../redux/modules/entries";
import * as SubscriptionsActions from "../redux/modules/subscriptions";
import * as CategoriesActions from "../redux/modules/categories";
import * as CurrentEntryActions from "../redux/modules/currentEntry";
import * as CurrentSidebarSelectionActions from "../redux/modules/currentSidebarSelection";
import * as ModalsActions from "../redux/modules/modals";

import { getSortedSubscriptions, getSortedCategories, getSortedEntries } from "../redux/selectors";

import { bindHotKey, unbindHotKey } from "../utils/HotKeys";

class MainApp extends Component {

  static propTypes = {
    sortedEntries: PropTypes.array.isRequired,
    entries: PropTypes.shape({
      listedIds: PropTypes.array.isRequired,
      byId: PropTypes.object.isRequired,
      hasMoreEntries: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    sortedSubscriptions: PropTypes.array.isRequired,
    subscriptions: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    sortedCategories: PropTypes.array.isRequired,
    currentEntry: PropTypes.object,
    currentUser: PropTypes.object,
    currentPath: PropTypes.string.isRequired,
    notification: PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    }),
    location: PropTypes.object.isRequired,
    currentSidebarSelection: PropTypes.object.isRequired,
    modals: PropTypes.object.isRequired,

    // actions
    userActions: PropTypes.object.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    currentEntryActions: PropTypes.object.isRequired,
    currentSidebarSelectionActions: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.refreshEntries = this.refreshEntries.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.openExternal = this.openExternal.bind(this);

    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);
    this.openEntryContentModal = this.openEntryContentModal.bind(this);

    this.debouncedNextEntry = debounce(this.nextEntry, 100);
    this.debouncedPreviousEntry = debounce(this.previousEntry, 100);
    this.debouncedOpenEntryContentModal = debounce(this.openEntryContentModal, 100);

    this.handleOnRemoveFeedOrCategory = this.handleOnRemoveFeedOrCategory.bind(this);
  }

  componentDidMount() {
    const { subscriptionsActions, categoriesActions, currentSidebarSelectionActions,
      entriesActions } = this.props;

    Promise.all([
      subscriptionsActions.requestFetchSubscriptions(),
      categoriesActions.requestFetchCategories()
    ]).then(() => {
      currentSidebarSelectionActions.changeSidebarSelection(
        this.sidebarSelectionParams(this.props));
    });

    entriesActions.requestFetchEntries(this.requestParams(this.props))
    .then(() => {
      this.firstEntry();
    });

    bindHotKey("nextEntry", () => this.debouncedNextEntry());
    bindHotKey("previousEntry", () => this.debouncedPreviousEntry());
    bindHotKey("openEntry", () => this.debouncedOpenEntryContentModal());
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
    const { subscriptions, categories } = props;

    const params = this.requestParams(props);
    if (params.subscription_id === "today" || params.subscription_id === "all") {
      return {};
    } else if (params.subscription_id) {
      return {
        selection: subscriptions.byId[+params.subscription_id],
        isSubscription: true
      };
    } else if (params.category_id) {
      return {
        selection: categories.byId[+params.category_id],
        isCategory: true
      };
    }

    return {};
  }

  // TODO: simplify
  requestParams(props) {
    if (props.params.id && props.location.pathname.startsWith("/subscriptions")) {
      return { subscription_id: +props.params.id };
    } else if (props.params.id && props.location.pathname.startsWith("/categories")) {
      return { category_id: +props.params.id };
    } else if (props.location.pathname === "/all") {
      return { subscription_id: "all" };
    } else if (props.location.pathname === "/today") {
      return { subscription_id: "today" };
    }

    return {};
  }

  refreshEntries() {
    const { entriesActions, subscriptionsActions } = this.props;
    entriesActions.requestRefreshEntries(this.requestParams(this.props))
      .then(() => {
        entriesActions.requestFetchEntries(this.requestParams(this.props));
        subscriptionsActions.requestFetchSubscriptions();
      });
  }

  nextEntry() {
    const { currentEntryActions, entriesActions, currentEntry } = this.props;
    if (currentEntry.hasNextEntry) {
      currentEntryActions.requestNextEntry();
    } else {
      entriesActions.requestLoadMore(this.requestParams(this.props)).then(() => {
        currentEntryActions.requestNextEntry();
      });
    }
  }

  firstEntry() {
    const { currentEntryActions } = this.props;
    currentEntryActions.requestFirstEntry();
  }

  previousEntry() {
    const { currentEntryActions } = this.props;
    currentEntryActions.requestPreviousEntry();
  }

  markAsRead() {
    const { sortedSubscriptions, subscriptionsActions, categoriesActions, entriesActions } = this.props;
    const params = this.requestParams(this.props);

    entriesActions.requestMarkAllEntriesAsRead(params).then(() => {
      if (params.subscription_id === "all" || params.subscription_id === "today") {
        subscriptionsActions.requestFetchSubscriptions().then(() => {
          categoriesActions.requestFetchCategories();
        });
      } else if (params.subscription_id) {
        subscriptionsActions.resetUnreadCount({ id: +params.subscription_id });
      } else if (params.category_id) {
        const matchedSubscriptions = sortedSubscriptions.filter(subscription =>
          subscription.category_id === +params.category_id);
        for (let subscription of matchedSubscriptions) {
          subscriptionsActions.resetUnreadCount({ id: subscription.id });
        }
      }
    });
  }

  openEntryContentModal() {
    const { modalsActions } = this.props;
    modalsActions.openEntryContentModal();
  }

  openExternal() {
    window.open(this.props.currentEntry.entry.url, "_blank");
  }

  handleOnRemoveFeedOrCategory() {
    const { subscriptionsActions, categoriesActions } = this.props;
    const params = this.requestParams(this.props);

    if (params.subscription_id) {
      subscriptionsActions.requestRemoveSubscription(+params.subscription_id);
    } else if (params.category_id) {
      categoriesActions.requestRemoveCategory(+params.category_id);
    }
  }

  render() {
    const {
      entries,
      sortedEntries,
      sortedCategories,
      sortedSubscriptions,
      currentUser,
      currentEntry,
      currentSidebarSelection,
      currentPath,
      notification,
      modals
    } = this.props;

    const {
      userActions,
      categoriesActions,
      subscriptionsActions,
      entriesActions,
      currentEntryActions,
      modalsActions
    } = this.props;

    return (
      <div className="main-app-container">

        <Sidebar
          subscriptions={sortedSubscriptions}
          categories={sortedCategories}
          currentPathname={currentPath}
          subscriptionsActions={subscriptionsActions}
          categoriesActions={categoriesActions}
          modalsActions={modalsActions}
          routerActions={routerActions}/>

        <MainAppViewLayout
          entries={entries}
          sortedEntries={sortedEntries}
          currentEntry={currentEntry}
          currentUser={currentUser}
          currentSidebarSelection={currentSidebarSelection}
          entriesActions={entriesActions}
          currentEntryActions={currentEntryActions}
          subscriptionsActions={subscriptionsActions}
          modalsActions={modalsActions}
          userActions={userActions}
          onNextEntryClick={this.nextEntry}
          onPreviousEntryClick={this.previousEntry}
          onOpenExternalClick={this.openExternal}
          onMarkAsReadClick={this.markAsRead}
          onRefreshEntriesClick={this.refreshEntries}
          onRemoveFeedOrCategoryClick={this.handleOnRemoveFeedOrCategory}
          onLoadMore={() => entriesActions.requestLoadMore(this.requestParams(this.props))}
          />

        {notification &&
          <Notification {...notification}/>
        }

        {modals.newFeedModalIsOpen &&
          <NewFeedDialog
            isOpen={modals.newFeedModalIsOpen}
            onClose={modalsActions.closeNewFeedModal}/>
        }

        {modals.entryContentModalIsOpen &&
          <EntryContentOverlay
            isOpen={modals.entryContentModalIsOpen}
            onClose={modalsActions.closeEntryContentModal}
            onPreviousClick={this.previousEntry}
            onNextClick={this.nextEntry}
            onOpenExternalClick={this.openExternal}/>
        }

        {modals.newCategoryModalIsOpen &&
          <NewCategoryDialog
            isOpen={modals.newCategoryModalIsOpen}
            onClose={modalsActions.closeNewCategoryModal}/>
        }

        {modals.editFeedOrCategoryModalIsOpen &&
          <EditDialog
            isOpen={modals.editFeedOrCategoryModalIsOpen}
            onClose={modalsActions.closeEditFeedOrCategoryModal}/>
        }

        {modals.opmlImportModalIsOpen &&
          <OpmlImportDialog
            isOpen={modals.opmlImportModalIsOpen}
            onClose={modalsActions.closeOpmlImportModal}/>
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentUser: state.user.current,
    subscriptions: state.subscriptions,
    sortedSubscriptions: getSortedSubscriptions(state),
    entries: state.entries,
    sortedEntries: getSortedEntries(state),
    sortedCategories: getSortedCategories(state),
    categories: state.categories,
    currentEntry: state.currentEntry,
    location: ownProps.location,
    currentPath: ownProps.location.pathname,
    notification: state.notification,
    currentSidebarSelection: state.currentSidebarSelection,
    modals: state.modals
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    entriesActions: bindActionCreators(EntriesActions, dispatch),
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    currentEntryActions: bindActionCreators(CurrentEntryActions, dispatch),
    currentSidebarSelectionActions: bindActionCreators(CurrentSidebarSelectionActions, dispatch),
    modalsActions: bindActionCreators(ModalsActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
