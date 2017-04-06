import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';
import Media from 'react-media';

import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import LayoutDetailPage from '../../../layouts/LayoutDetailPage';

import FeedEntryContent from '../components/detail/FeedEntryContent';
import EntryContentToolbarContainer from './EntryContentToolbarContainer';
import FeedEntryEmbedWebsiteContent from '../components/detail/FeedEntryEmbedWebsiteContent';
import FeedEntryEmbedArticleContent from '../components/detail/FeedEntryEmbedArticleContent';

import * as EntriesActions from '../actions';
import user from '../../user';
import * as SubscriptionsActions from '../../subscriptions/actions';

import { getEnhancedEntry } from '../../../redux/selectors';

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
    children: PropTypes.node,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,

    decrementUnreadCount: PropTypes.func.isRequired,
    requestMarkEntryAsRead: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      currentViewMode: 'normal',
      showSpinner: false,
    };

    this.handleEntryShown = this.handleEntryShown.bind(this);

    this.onChangeViewModeClick = this.onChangeViewModeClick.bind(this);
    this.onLoadingStart = this.onLoadingStart.bind(this);
    this.onLoadingComplete = this.onLoadingComplete.bind(this);
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

  handleEntryShown(entry) {
    const { requestMarkEntryAsRead, decrementUnreadCount } = this.props;
    requestMarkEntryAsRead(entry).then(() => {
      decrementUnreadCount({ id: entry.subscription_id });
    });
  }

  render() {
    const {
      entry,
      params,
      pathname
    } = this.props;

    const entryContentToolbar = (
      <EntryContentToolbarContainer
        params={params}
        pathname={pathname}
        currentViewMode={this.state.currentViewMode}
        showSpinner={this.state.showSpinner}
        onChangeViewModeClick={this.onChangeViewModeClick}
      />
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
    entries: state.entries,
    entry: getEnhancedEntry(state, ownProps),
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
