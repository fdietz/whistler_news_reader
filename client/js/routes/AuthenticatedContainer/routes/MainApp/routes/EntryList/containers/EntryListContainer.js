import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import debounce from 'lodash.debounce';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';
import classNames from 'classnames';
import { Link } from 'react-router';

import LayoutHeader from 'layouts/LayoutHeader';
import LayoutContent from 'layouts/LayoutContent';
import InfiniteScroll from '../components/InfiniteScroll';
import EntryList from '../components/EntryList';
import EntryGrid from '../components/EntryGrid';
import NoMoreContent from '../components/NoMoreContent';
import EntryListToolbar from '../components/EntryListToolbar';
import EntryListToolbarMobile from '../components/EntryListToolbarMobile';
import Teaser from 'components/Teaser';
import { CheckmarkSVGIcon, EarthSVGIcon } from 'components/SVGIcon';

import * as UserActions from 'redux/modules/user';
import * as EntriesActions from 'redux/modules/entries';
import * as SubscriptionsActions from 'redux/modules/subscriptions';
import * as CategoriesActions from 'redux/modules/categories';
import * as SidebarActions from 'redux/modules/sidebar';

import {
  getSortedSubscriptions,
  getSortedEntries,
  getHasPreviousEntry,
  getHasNextEntry,
  getPreviousEntryId,
  getNextEntryId,
} from 'redux/selectors';

import { bindHotKey, unbindHotKey } from 'utils/HotKeys';
import { entryPath, mapRequestParams, configPathname } from 'utils/navigator';

class EntryListContainer extends Component {
  static propTypes = {
    sortedEntries: PropTypes.array.isRequired,
    entries: PropTypes.shape({
      listedIds: PropTypes.array.isRequired,
      byId: PropTypes.object.isRequired,
      hasMoreEntries: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
    entry: PropTypes.object,
    sidebar: PropTypes.object.isRequired,
    hasPreviousEntry: PropTypes.bool.isRequired,
    hasNextEntry: PropTypes.bool.isRequired,
    previousEntryId: PropTypes.number,
    nextEntryId: PropTypes.number,
    sortedSubscriptions: PropTypes.array.isRequired,
    subscriptions: PropTypes.object.isRequired,
    categories: PropTypes.object.isRequired,
    currentUser: PropTypes.object,
    notification: PropTypes.shape({
      message: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.node,

    // actions
    userActions: PropTypes.object.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    sidebarActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentViewLayout: 'list',
    };

    this.handleSelectCurrentEntry = this.handleSelectCurrentEntry.bind(this);
    this.handleViewLayoutChange = this.handleViewLayoutChange.bind(this);

    this.refreshEntries = this.refreshEntries.bind(this);
    this.markAsRead = this.markAsRead.bind(this);
    this.openExternal = this.openExternal.bind(this);

    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.handleOnRemoveFeedOrCategory = this.handleOnRemoveFeedOrCategory.bind(this);

    this.debouncedNextEntry = debounce(this.nextEntry, 100);
    this.debouncedPreviousEntry = debounce(this.previousEntry, 100);

    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    const { entriesActions } = this.props;

    entriesActions.requestFetchEntries(this.requestParams(this.props))
    .then(() => {
      this.firstEntry();
    });

    bindHotKey('nextEntry', () => this.debouncedNextEntry());
    bindHotKey('previousEntry', () => this.debouncedPreviousEntry());
    bindHotKey('openEntry', () => this.debouncedOpenEntryContentModal());
  }

  componentWillReceiveProps(nextProps) {
    const { entriesActions } = this.props;

    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key) {
      const np = this.requestParams(nextProps);
      const p = this.requestParams(this.props);

      // TODO: clean this up
      if (p.subscription_id && np.subscription_id && p.subscription_id === np.subscription_id) {
      } else if (p.category_id && np.category_id && p.category_id === np.category_id) {
      } else {
        entriesActions.requestFetchEntries(np);
        // entriesActions.requestFetchEntries(np).then(() => this.firstEntry());
      }
    }
  }

  componentWillUnmount() {
    unbindHotKey('nextEntry');
    unbindHotKey('previousEntry');
    unbindHotKey('openEntry');
  }

  requestParams(props) {
    const { params, pathname } = props;
    return mapRequestParams(params, pathname);
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
    const { entriesActions, hasNextEntry, nextEntryId } = this.props;
    if (hasNextEntry) {
      this.navigateTo(nextEntryId);
    } else {
      entriesActions.requestLoadMore(this.requestParams(this.props)).then(() => {
        this.navigateTo(nextEntryId);
      });
    }
  }

  firstEntry() {
    const { entries } = this.props;
    if (entries.listedIds.length > 0) {
      const entryId = entries.listedIds[0];
      this.navigateTo(entryId);
    }
  }

  previousEntry() {
    const { hasPreviousEntry, previousEntryId } = this.props;
    if (hasPreviousEntry) {
      this.navigateTo(previousEntryId);
    }
  }

  markAsRead() {
    const {
      sortedSubscriptions,
      subscriptionsActions,
      categoriesActions,
      entriesActions
    } = this.props;
    const params = this.requestParams(this.props);

    entriesActions.requestMarkAllEntriesAsRead(params).then(() => {
      if (params.subscription_id === 'all' || params.subscription_id === 'today') {
        subscriptionsActions.requestFetchSubscriptions().then(() => {
          categoriesActions.requestFetchCategories();
        });
      } else if (params.subscription_id) {
        subscriptionsActions.resetUnreadCount({ id: +params.subscription_id });
      } else if (params.category_id) {
        const matchedSubscriptions = sortedSubscriptions.filter(subscription =>
          subscription.category_id === +params.category_id);
        for (const subscription of matchedSubscriptions) {
          subscriptionsActions.resetUnreadCount({ id: subscription.id });
        }
      }
    });
  }

  openExternal() {
    window.open(this.props.entry.url, '_blank');
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

  navigateTo(entryId) {
    const { routerActions, params, pathname } = this.props;
    routerActions.push(entryPath(entryId, params, pathname));
  }

  handleSelectCurrentEntry(entry) {
    this.navigateTo(entry.id);
  }

  handleViewLayoutChange(value) {
    this.setState({ currentViewLayout: value });
  }

  handleRefresh(event) {
    event.preventDefault();
    this.refreshEntries();
  }

  openEditModal() {
    const { routerActions, params, pathname } = this.props;

    routerActions.push({ pathname: configPathname(params, pathname), state: { modal: true } });
  }

  getTitle() {
    const { subscriptions, categories } = this.props;
    const isSubscriptionSelected = location.pathname.startsWith('/subscriptions');
    const isCategorySelected = location.pathname.startsWith('/categories');
    const params = this.requestParams(this.props);

    let title = '';
    if (params.subscription_id === 'all') {
      title = 'All';
    } else if (params.subscription_id === 'today') {
      title = 'Today';
    } else if (isSubscriptionSelected) {
      const subscription = subscriptions.byId[+params.subscription_id];
      if (subscription) title = subscription.title;
    } else if (isCategorySelected) {
      const category = categories.byId[+params.category_id];
      if (category) title = category.title;
    }

    return title;
  }

  render() {
    const { currentViewLayout } = this.state;
    const {
      entries,
      sortedEntries,
      sortedSubscriptions,
      entry,
      location,
      hasPreviousEntry,
      hasNextEntry,
    } = this.props;
    const { entriesActions, sidebarActions } = this.props;

    let items;
    if (currentViewLayout === 'list' || currentViewLayout === 'compact_list') {
      items = (
        <EntryList
          entries={sortedEntries}
          currentEntry={entry}
          onEntryClick={e => this.handleSelectCurrentEntry(e)}
          className={currentViewLayout === 'compact_list' ? 'compact' : ''}
      />
      );
    } else if (currentViewLayout === 'grid') {
      items = (
        <EntryGrid
          entries={sortedEntries}
          currentEntry={entry}
          onEntryClick={e => this.handleSelectCurrentEntry(e)}
      />
      );
    } else {
      throw Error(`Unknown currentViewLayout ${currentViewLayout}`);
    }

    const paginatedItems = (
      <InfiniteScroll
        threshold={300}
        loadMore={() => entriesActions.requestLoadMore(this.requestParams(this.props))}
        hasMore={entries.hasMoreEntries}>

        {entries.listedIds.length > 0 && items}
        {!entries.hasMoreEntries && <NoMoreContent />}
      </InfiniteScroll>
    );

    const isSubscriptionSelected = location.pathname.startsWith('/subscriptions');
    const isCategorySelected = location.pathname.startsWith('/categories');

    const entryListToolbar = (
      <EntryListToolbar
        currentViewLayout={currentViewLayout}
        showSpinner={entries.isLoading}
        hasPreviousEntry={hasPreviousEntry}
        hasNextEntry={hasNextEntry}
        isSubscriptionSelected={isSubscriptionSelected}
        isCategorySelected={isCategorySelected}
        onMarkAsReadClick={this.markAsRead}
        onRefreshEntriesClick={this.refreshEntries}
        onRemoveFeedOrCategoryClick={this.handleOnRemoveFeedOrCategory}
        onViewLayoutChangeClick={this.handleViewLayoutChange}
        onOpenEditFeedOrCategoryModalClick={this.openEditModal}
        onPreviousEntryClick={this.previousEntry}
        onNextEntryClick={this.nextEntry}
        onOpenExternalClick={this.openExternal}
        onToggleSidebarClick={sidebarActions.toggle} />
    );


    const entryListToolbarMobile = (
      <EntryListToolbarMobile
        title={this.getTitle()}
        currentViewLayout={currentViewLayout}
        showSpinner={entries.isLoading}
        hasPreviousEntry={hasPreviousEntry}
        hasNextEntry={hasNextEntry}
        isSubscriptionSelected={isSubscriptionSelected}
        isCategorySelected={isCategorySelected}
        onMarkAsReadClick={this.markAsRead}
        onRefreshEntriesClick={this.refreshEntries}
        onRemoveFeedOrCategoryClick={this.handleOnRemoveFeedOrCategory}
        onViewLayoutChangeClick={this.handleViewLayoutChange}
        onOpenEditFeedOrCategoryModalClick={this.openEditModal}
        onPreviousEntryClick={this.previousEntry}
        onNextEntryClick={this.nextEntry}
        onOpenExternalClick={this.openExternal}
        onToggleSidebarClick={sidebarActions.toggle} />
    );

    const hasChildren = React.Children.count(this.props.children) > 0;

    const masterListCls = classNames('master-list', {
      grid: currentViewLayout === 'grid',
      'hide-small-screen': hasChildren
    });

    return (
      <div className="main-master-container">
        {!hasChildren && sortedSubscriptions.length === 0 &&
          <div className="layout-master-container">
            <LayoutHeader>{entryListToolbar}{entryListToolbarMobile}</LayoutHeader>
            <LayoutContent>
              <Teaser>
                <EarthSVGIcon size="xxlarge" color="gray" />
                <h1>Welcome to whistle'r news reader</h1>
                <h2>This is exciting!</h2>
                <p>
                  Let's get started and <Link to={{ pathname: '/opml_import', state: { modal: true } }}>import</Link> or <Link to={{ pathname: '/feeds/new', state: { modal: true } }}>subscribe</Link> to new feeds.
                </p>
              </Teaser>
            </LayoutContent>
          </div>
        }

        {sortedSubscriptions.length > 0 && entries.listedIds.length > 0 &&
          <div className={masterListCls}>
            {currentViewLayout === 'list' &&
              <div className="layout-master-container">
                <LayoutHeader>{entryListToolbar}{entryListToolbarMobile}</LayoutHeader>
                <LayoutContent>{paginatedItems}</LayoutContent>
              </div>
            }
            {currentViewLayout === 'compact_list' &&
              <div className="layout-master-container">
                <LayoutHeader>{entryListToolbar}{entryListToolbarMobile}</LayoutHeader>
                <LayoutContent>{paginatedItems}</LayoutContent>
              </div>
            }
            {currentViewLayout === 'grid' &&
              <div className="layout-master-container">
                <LayoutHeader>{entryListToolbar}{entryListToolbarMobile}</LayoutHeader>
                <LayoutContent>{paginatedItems}</LayoutContent>
              </div>
            }
          </div>
        }

        {!hasChildren && sortedSubscriptions.length > 0 && entries.listedIds.length > 0 &&
          <div className="layout-master-container hide-small-screen">
            <LayoutHeader />
            <LayoutContent>
              <Teaser>
                <EarthSVGIcon size="xxlarge" color="gray" />
                <h2>Moin moin from Hamburg</h2>
                <p>Have a nice day!</p>
              </Teaser>
            </LayoutContent>
          </div>
        }

        {!hasChildren && sortedSubscriptions.length > 0 && entries.listedIds.length === 0 &&
          <div className="layout-master-container">
            <LayoutHeader>{entryListToolbar}{entryListToolbarMobile}</LayoutHeader>
            <LayoutContent>
              <Teaser>
                <CheckmarkSVGIcon size="xxlarge" color="gray" />
                <h2>Nothing left to read here</h2>
                <p>
                  You can try to  <a href="#" onClick={this.handleRefresh}>refresh</a> or <Link to={{ pathname: '/feeds/new', state: { modal: true } }}>subscribe</Link> to new feeds.
                </p>
              </Teaser>
            </LayoutContent>
          </div>
        }

        {hasChildren &&
          this.props.children
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
    sidebar: state.sidebar,
    entry: state.entries.byId[ownProps.params.id],
    hasPreviousEntry: getHasPreviousEntry(state, ownProps),
    hasNextEntry: getHasNextEntry(state, ownProps),
    previousEntryId: getPreviousEntryId(state, ownProps),
    nextEntryId: getNextEntryId(state, ownProps),
    sortedEntries: getSortedEntries(state),
    categories: state.categories,
    pathname: ownProps.location.pathname,
    location: ownProps.location,
    notification: state.notification,
    modals: state.modals,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    entriesActions: bindActionCreators(EntriesActions, dispatch),
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    routerActions: bindActionCreators(RouterActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryListContainer);
