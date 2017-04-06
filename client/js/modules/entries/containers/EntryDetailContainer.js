import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';
import Media from 'react-media';

import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import LayoutDetailPage from '../../../layouts/LayoutDetailPage';

import FeedEntryContent from '../components/detail/FeedEntryContent';
import EntryContentToolbar from '../components/EntryContentToolbar';
import FeedEntryEmbedWebsiteContent from '../components/detail/FeedEntryEmbedWebsiteContent';
import FeedEntryEmbedArticleContent from '../components/detail/FeedEntryEmbedArticleContent';

import * as EntriesActions from '../actions';
import user from '../../user';
import * as SubscriptionsActions from '../../subscriptions/actions';

import {
  getHasPreviousEntry,
  getHasNextEntry,
  getPreviousEntryId,
  getNextEntryId,
  getEnhancedEntry
} from '../../../redux/selectors';

import { entryPath, mapRequestParams, goBackPathname } from '../../../utils/navigator';

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

    decrementUnreadCount: PropTypes.func.isRequired,
    requestMarkEntryAsRead: PropTypes.func.isRequired,
    requestLoadMore: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
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


  onGoBackClick() {
    const { push, params, pathname } = this.props;

    push(goBackPathname(params, pathname));
  }

  onChangeViewModeClick(mode) {
    this.setState({ currentViewMode: mode });
  }

  onLoadingStart() {
    this.setState({ showSpinner: true });
  }

  onLoadingComplete() {
    this.setState({ showSpinner: false });
  }

  onOpenExternalClick() {
    window.open(this.props.entry.url, '_blank');
  }

  handleEntryShown(entry) {
    const { requestMarkEntryAsRead, decrementUnreadCount } = this.props;
    requestMarkEntryAsRead(entry).then(() => {
      decrementUnreadCount({ id: entry.subscription_id });
    });
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

  requestParams(props) {
    const { params, pathname } = props;
    return mapRequestParams(params, pathname);
  }

  navigateTo(entryId) {
    const { push, params, pathname } = this.props;
    push(entryPath(entryId, params, pathname));
  }

  render() {
    const {
      entry,
      hasPreviousEntry,
      hasNextEntry,
    } = this.props;

    const entryContentToolbar = (
      <Media query="(max-width: 40em)">
        {
          (matches) => (
            <EntryContentToolbar
              isMobile={matches}
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
              onChangeViewModeClick={this.onChangeViewModeClick} />
          )
        }
      </Media>
    );

    return (
      <LayoutDetailPage>
        <LayoutContainer>
          <LayoutHeader>{entryContentToolbar}</LayoutHeader>
          <LayoutContent>
            {entry && this.state.currentViewMode === 'normal' &&
              <FeedEntryContent
                entry={entry}
                onLoadingComplete={this.onLoadingComplete}
                onLoadingStart={this.onLoadingStart}
                onEntryShown={this.handleEntryShown} />
            }
            {entry && this.state.currentViewMode === 'article' &&
              <FeedEntryEmbedArticleContent
                entry={entry}
                onLoadingStart={this.onLoadingStart}
                onLoadingComplete={this.onLoadingComplete}
                onEntryShown={this.handleEntryShown} />
            }
            {entry && this.state.currentViewMode === 'website' &&
              <FeedEntryEmbedWebsiteContent
                entry={entry}
                onLoadingStart={this.onLoadingStart}
                onLoadingComplete={this.onLoadingComplete}
                onEntryShown={this.handleEntryShown} />
            }
          </LayoutContent>
        </LayoutContainer>
        {this.props.children}
      </LayoutDetailPage>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    currentUser: state.user.current,
    entries: state.entries,
    entry: getEnhancedEntry(state, ownProps),
    hasPreviousEntry: getHasPreviousEntry(state, ownProps),
    hasNextEntry: getHasNextEntry(state, ownProps),
    previousEntryId: getPreviousEntryId(state, ownProps),
    nextEntryId: getNextEntryId(state, ownProps),
    pathname: ownProps.location.pathname,
  };
}

const dispatchToProps = {
  ...user.actions,
  ...EntriesActions,
  ...SubscriptionsActions,
  ...RouterActions
};

export default connect(mapStateToProps, dispatchToProps)(EntryDetailContainer);
