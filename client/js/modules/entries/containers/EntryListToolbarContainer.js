import debounce from 'lodash.debounce';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import Media from 'react-media';

import EntryListToolbar from '../components/EntryListToolbar';

import { mapRequestParams, configPathname } from '../../../utils/navigator';
import { bindHotKey, unbindHotKey } from '../../../utils/HotKeys';

import * as entriesActions from '../actions';
import * as subscriptionsActions from '../../subscriptions/actions';
import * as categoriesActions from '../../categories/actions';
import * as commonActions from '../../../actions';
import * as sidebarActions from '../../sidebar/actions';

import {
  getSortedSubscriptions,
  getHasPreviousEntry,
  getHasNextEntry,
  getPreviousEntryId,
  getNextEntryId,
  isSubscriptionSelected,
  isCategorySelected
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
    requestRemoveFeedOrCategory: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    navigateToEntry: PropTypes.func.isRequired,
    requestLoadMore: PropTypes.func.isRequired,
    requestMarkAllEntriesAsRead: PropTypes.func.isRequired,
    resetUnreadCount: PropTypes.func.isRequired,
    requestRefreshEntries: PropTypes.func.isRequired,
    requestFetchCategories: PropTypes.func.isRequired,
    requestFetchSubscriptions: PropTypes.func.isRequired,
    requestFetchEntries: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired
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
    const { requestRemoveFeedOrCategory, params, pathname } = this.props;
    requestRemoveFeedOrCategory(params, pathname);
  }

  openEditModal() {
    const { push, params, pathname } = this.props;

    push({ pathname: configPathname(params, pathname), state: { modal: true } });
  }

  navigateTo(entryId) {
    const { navigateToEntry, params, pathname } = this.props;
    navigateToEntry(entryId, params, pathname);
  }

  nextEntry() {
    const { requestLoadMore, hasNextEntry, nextEntryId } = this.props;
    if (hasNextEntry) {
      this.navigateTo(nextEntryId);
    } else {
      requestLoadMore(this.requestParams(this.props)).then(() => {
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
      requestMarkAllEntriesAsRead,
      requestFetchSubscriptions,
      requestFetchCategories,
      resetUnreadCount,
      sortedSubscriptions
    } = this.props;
    const params = this.requestParams(this.props);

    requestMarkAllEntriesAsRead(params).then(() => {
      if (params.subscription_id === 'all' || params.subscription_id === 'today') {
        requestFetchSubscriptions().then(() => {
          requestFetchCategories();
        });
      } else if (params.subscription_id) {
        resetUnreadCount({ id: +params.subscription_id });
      } else if (params.category_id) {
        const matchedSubscriptions = sortedSubscriptions.filter(subscription =>
          subscription.category_id === +params.category_id);
        for (const subscription of matchedSubscriptions) {
          resetUnreadCount({ id: subscription.id });
        }
      }
    });
  }

  handleRefresh(event) {
    const { requestRefreshEntries, params, pathname } = this.props;
    event.preventDefault();
    requestRefreshEntries(params, pathname);
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
              onToggleSidebarClick={this.props.toggle} />
          )
        }
      </Media>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isSubscriptionSelected: isSubscriptionSelected(state, ownProps),
    isCategorySelected: isCategorySelected(state, ownProps),

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

const mapDispatchToProps = {
  ...entriesActions,
  ...subscriptionsActions,
  ...categoriesActions,
  ...sidebarActions,
  ...routerActions,
  ...commonActions
};
export default connect(mapStateToProps, mapDispatchToProps)(EntryListToolbarContainer);
