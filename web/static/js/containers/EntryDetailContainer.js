import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';

import LayoutHeader from '../components/LayoutHeader';
import LayoutContent from '../components/LayoutContent';
import FeedEntryContent from '../components/FeedEntryContent';
import EntryContentToolbar from '../components/EntryContentToolbar';
import ProfileToolbar from '../components/ProfileToolbar';
import FeedEntryEmbedWebsiteContent from '../components/FeedEntryEmbedWebsiteContent';
import FeedEntryEmbedArticleContent from '../components/FeedEntryEmbedArticleContent';

import * as UserActions from '../redux/modules/user';
import * as EntriesActions from '../redux/modules/entries';
import * as SubscriptionsActions from '../redux/modules/subscriptions';
import * as CategoriesActions from '../redux/modules/categories';

import {
  getHasPreviousEntry,
  getHasNextEntry,
  getPreviousEntryId,
  getNextEntryId,
} from '../redux/selectors';

import { entryPath, mapRequestParams, goBackPathname } from '../utils/navigator';

class EntryDetailContainer extends Component {

  static propTypes = {
    entries: PropTypes.shape({
      listedIds: PropTypes.array.isRequired,
      byId: PropTypes.object.isRequired,
      hasMoreEntries: PropTypes.bool.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
    entry: PropTypes.object,
    hasPreviousEntry: PropTypes.bool.isRequired,
    hasNextEntry: PropTypes.bool.isRequired,
    previousEntryId: PropTypes.number,
    nextEntryId: PropTypes.number,
    currentUser: PropTypes.object,
    children: PropTypes.node,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,

    userActions: PropTypes.object.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      currentViewMode: 'normal',
      showSpinner: false,
    };

    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);
    this.handleEntryShown = this.handleEntryShown.bind(this);
    this.onOpenExternalClick = this.onOpenExternalClick.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.onChangeViewModeClick = this.onChangeViewModeClick.bind(this);
    this.onLoadingStart = this.onLoadingStart.bind(this);
    this.onLoadingComplete = this.onLoadingComplete.bind(this);
  }

  handleEntryShown(entry) {
    const { entriesActions, subscriptionsActions } = this.props;
    entriesActions.requestMarkEntryAsRead(entry).then(() => {
      subscriptionsActions.decrementUnreadCount({ id: entry.subscription_id });
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

  previousEntry() {
    const { hasPreviousEntry, previousEntryId } = this.props;
    if (hasPreviousEntry) {
      this.navigateTo(previousEntryId);
    }
  }

  onOpenExternalClick() {
    window.open(this.props.entry.url, '_blank');
  }

  requestParams(props) {
    const { params, pathname } = props;
    return mapRequestParams(params, pathname);
  }

  navigateTo(entryId) {
    const { routerActions, params, pathname } = this.props;
    routerActions.push(entryPath(entryId, params, pathname));
  }

  onGoBackClick() {
    const { routerActions, params, pathname } = this.props;

    routerActions.push(goBackPathname(params, pathname));
  }

  onChangeViewModeClick(mode) {
    console.log('mode', mode);
    this.setState({ currentViewMode: mode });
  }

  onLoadingStart() {
    this.setState({ showSpinner: true });
  }

  onLoadingComplete() {
    this.setState({ showSpinner: false });
  }

  render() {
    const {
      entry,
      currentUser,
      hasPreviousEntry,
      hasNextEntry,
    } = this.props;
    const { userActions, routerActions } = this.props;

    const entryContentToolbar = (
      <EntryContentToolbar
        entry={entry}
        currentViewMode={this.state.currentViewMode}
        showSpinner={this.state.showSpinner}
        hasPreviousEntry={hasPreviousEntry}
        hasNextEntry={hasNextEntry}
        onPreviousEntryClick={this.previousEntry}
        onNextEntryClick={this.nextEntry}
        onOpenExternalClick={this.onOpenExternalClick}
        showEntryContentModalButton
        onGoBackClick={this.onGoBackClick}
        onChangeViewModeClick={this.onChangeViewModeClick}
    />
    );

    const profileToolbar = (
      <ProfileToolbar
        currentUser={currentUser}
        userActions={userActions}
        routerActions={routerActions}
        className="hide-small-screen"
    />
    );

    return (
      <div className="main-detail-container">
        <div className="detail">
          <div className="layout-master-container">
            <LayoutHeader>{entryContentToolbar}{profileToolbar}</LayoutHeader>
            <LayoutContent>
              {entry && this.state.currentViewMode === 'normal' &&
                <FeedEntryContent
                  entry={entry}
                  onLoadingComplete={this.onLoadingComplete}
                  onLoadingStart={this.onLoadingStart}
                  onEntryShown={this.handleEntryShown}
    />
              }
              {entry && this.state.currentViewMode === 'article' &&
                <FeedEntryEmbedArticleContent
                  entry={entry}
                  onLoadingStart={this.onLoadingStart}
                  onLoadingComplete={this.onLoadingComplete}
                  onEntryShown={this.handleEntryShown}
    />
              }
              {entry && this.state.currentViewMode === 'website' &&
                <FeedEntryEmbedWebsiteContent
                  entry={entry}
                  onLoadingStart={this.onLoadingStart}
                  onLoadingComplete={this.onLoadingComplete}
                  onEntryShown={this.handleEntryShown}
    />
              }
            </LayoutContent>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentUser: state.user.current,
    entries: state.entries,
    entry: state.entries.byId[ownProps.params.id],
    hasPreviousEntry: getHasPreviousEntry(state, ownProps),
    hasNextEntry: getHasNextEntry(state, ownProps),
    previousEntryId: getPreviousEntryId(state, ownProps),
    nextEntryId: getNextEntryId(state, ownProps),
    pathname: ownProps.location.pathname,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    entriesActions: bindActionCreators(EntriesActions, dispatch),
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    routerActions: bindActionCreators(RouterActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetailContainer);
