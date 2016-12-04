import debounce from 'lodash.debounce';
import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';
import Media from 'react-media';

import sidebar from '../../sidebar';

import EntryListToolbar from '../components/EntryListToolbar';

import { mapRequestParams, configPathname } from '../../../utils/navigator';
import { bindHotKey, unbindHotKey } from '../../../utils/HotKeys';

import * as EntriesActions from '../actions';
import * as SubscriptionsActions from '../../subscriptions/actions';
import * as CategoriesActions from '../../categories/actions';
import * as CommonActions from '../../../actions';

import {
  getSortedSubscriptions,
  getHasPreviousEntry,
  getHasNextEntry,
  getPreviousEntryId,
  getNextEntryId,
} from '../../../redux/selectors';

class EntryListToolbarContainer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    currentViewLayout: PropTypes.string.isRequired,
    hasPreviousEntry: PropTypes.bool.isRequired,
    hasNextEntry: PropTypes.bool.isRequired,
    previousEntryId: PropTypes.number,
    nextEntryId: PropTypes.number,
    isSubscriptionSelected: PropTypes.bool.isRequired,
    isCategorySelected: PropTypes.bool.isRequired,

    subscriptions: PropTypes.object.isRequired,
    sortedSubscriptions: PropTypes.array.isRequired,
    categories: PropTypes.object.isRequired,
    showSpinner: PropTypes.bool.isRequired,

    // actions
    onViewLayoutChangeClick: PropTypes.func.isRequired,
    entriesActions: PropTypes.object.isRequired,
    sidebarActions: PropTypes.object.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    commonActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.markAsRead = this.markAsRead.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.handleOnRemoveFeedOrCategory = this.handleOnRemoveFeedOrCategory.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);

    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);

    this.debouncedNextEntry = debounce(this.nextEntry, 100);
    this.debouncedPreviousEntry = debounce(this.previousEntry, 100);
  }

  componentDidMount() {
    bindHotKey('nextEntry', () => this.debouncedNextEntry());
    bindHotKey('previousEntry', () => this.debouncedPreviousEntry());
    bindHotKey('openEntry', () => this.debouncedOpenEntryContentModal());
  }

  componentWillUnmount() {
    unbindHotKey('nextEntry');
    unbindHotKey('previousEntry');
    unbindHotKey('openEntry');
  }

  getTitle() {
    const { subscriptions, categories, params, pathname } = this.props;
    const isSubscriptionSelected = pathname.startsWith('/subscriptions');
    const isCategorySelected = pathname.startsWith('/categories');
    const mappedParams = mapRequestParams(params, pathname);

    let title = '';
    if (mappedParams.subscription_id === 'all') {
      title = 'All';
    } else if (mappedParams.subscription_id === 'today') {
      title = 'Today';
    } else if (isSubscriptionSelected) {
      const subscription = subscriptions.byId[+mappedParams.subscription_id];
      if (subscription) title = subscription.title;
    } else if (isCategorySelected) {
      const category = categories.byId[+mappedParams.category_id];
      if (category) title = category.title;
    }

    return title;
  }

  handleOnRemoveFeedOrCategory() {
    const { commonActions, params, pathname } = this.props;
    commonActions.requestRemoveFeedOrCategory(params, pathname);
  }

  openEditModal() {
    const { routerActions, params, pathname } = this.props;

    routerActions.push({ pathname: configPathname(params, pathname), state: { modal: true } });
  }

  navigateTo(entryId) {
    const { commonActions, params, pathname } = this.props;
    commonActions.navigateToEntry(entryId, params, pathname);
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

  handleRefresh(event) {
    const { commonActions, params, pathname } = this.props;
    event.preventDefault();
    commonActions.requestRefreshEntries(params, pathname);
  }

  requestParams(props) {
    const { params, pathname } = props;
    return mapRequestParams(params, pathname);
  }

  render() {
    return (
      <Media query="(max-width: 40em)">
        {
          (matches) => (
            <EntryListToolbar
              isMobile={matches}
              title={this.getTitle()}

              // injected from EntryListContainer
              currentViewLayout={this.props.currentViewLayout}
              onViewLayoutChangeClick={this.props.onViewLayoutChangeClick}

              isSubscriptionSelected={this.props.isSubscriptionSelected}
              isCategorySelected={this.props.isCategorySelected}
              showSpinner={this.props.showSpinner}
              onMarkAsReadClick={this.markAsRead}
              onRefreshEntriesClick={this.handleRefresh}
              onRemoveFeedOrCategoryClick={this.handleOnRemoveFeedOrCategory}
              onOpenEditFeedOrCategoryModalClick={this.openEditModal}
              onToggleSidebarClick={this.props.sidebarActions.toggle} />
          )
        }
      </Media>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isSubscriptionSelected: ownProps.pathname.startsWith('/subscriptions'),
    isCategorySelected: ownProps.pathname.startsWith('/categories'),

    subscriptions: state.subscriptions,
    sortedSubscriptions: getSortedSubscriptions(state),
    showSpinner: state.entries.isLoading,
    categories: state.categories,

    hasPreviousEntry: getHasPreviousEntry(state, ownProps),
    hasNextEntry: getHasNextEntry(state, ownProps),
    previousEntryId: getPreviousEntryId(state, ownProps),
    nextEntryId: getNextEntryId(state, ownProps),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    entriesActions: bindActionCreators(EntriesActions, dispatch),
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    sidebarActions: bindActionCreators(sidebar.actions, dispatch),
    routerActions: bindActionCreators(RouterActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryListToolbarContainer);
