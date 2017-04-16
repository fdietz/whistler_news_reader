import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import MasterDetail from '../../../layouts/MasterDetail';

import InfiniteScroll from '../components/InfiniteScroll';
import EntryList from '../components/list/EntryList';

import EntryListToolbarContainer from './EntryListToolbarContainer';

import NoMoreContent from '../components/NoMoreContent';
import NothingLeftToReadTeaser from '../components/NothingLeftToReadTeaser';
import LoadingTeaser from '../components/LoadingTeaser';

import * as entriesActions from '../actions';
import * as commonActions from '../../../actions';

import {
  getSortedSubscriptions,
  getSortedEntries,
  getCurrentEntry
} from '../../../redux/selectors';

import { mapRequestParams } from '../../../utils/navigator';

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
    currentEntry: PropTypes.object,
    sortedSubscriptions: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.node,

    // actions
    requestRefreshEntries: PropTypes.func.isRequired,
    requestFetchEntries: PropTypes.func.isRequired,
    navigateToEntry: PropTypes.func.isRequired,
    requestLoadMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentViewLayout: 'list',
    };

    this.handleSelectCurrentEntry = this.handleSelectCurrentEntry.bind(this);
    this.handleViewLayoutChange = this.handleViewLayoutChange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  componentDidMount() {
    const { requestFetchEntries } = this.props;

    requestFetchEntries(this.requestParams(this.props))
      .then(() => {
        this.firstEntry();
      });
  }

  componentWillReceiveProps(nextProps) {
    const { requestFetchEntries } = this.props;

    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key) {
      const np = this.requestParams(nextProps);
      const p = this.requestParams(this.props);

      // TODO: clean this up
      if (p.subscription_id && np.subscription_id && p.subscription_id === np.subscription_id) {
        // noop
      } else if (p.category_id && np.category_id && p.category_id === np.category_id) {
        // noop
      } else {
        requestFetchEntries(np);
      }
    }
  }

  firstEntry() {
    const { entries } = this.props;
    if (entries.listedIds.length > 0) {
      const entryId = entries.listedIds[0];
      this.navigateTo(entryId);
    }
  }

  navigateTo(entryId) {
    const { navigateToEntry, params, pathname } = this.props;
    navigateToEntry(entryId, params, pathname);
  }

  handleSelectCurrentEntry(entry) {
    this.navigateTo(entry.id);
  }

  handleViewLayoutChange(value) {
    this.setState({ currentViewLayout: value });
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
    const { currentViewLayout } = this.state;
    const {
      entries,
      sortedEntries,
      sortedSubscriptions,
      currentEntry,
    } = this.props;
    const { requestLoadMore } = this.props;

    const items = (
      <EntryList
        entries={sortedEntries}
        currentEntry={currentEntry}
        onEntryClick={e => this.handleSelectCurrentEntry(e)}
      />
    );

    const paginatedItems = (
      <InfiniteScroll
        threshold={300}
        loadMore={() => requestLoadMore(this.requestParams(this.props))}
        hasMore={entries.hasMoreEntries}>

        {entries.listedIds.length > 0 && items}
        {!entries.hasMoreEntries && <NoMoreContent />}
      </InfiniteScroll>
    );

    const responsiveToolbar = (
      <EntryListToolbarContainer
        params={this.props.params}
        pathname={this.props.pathname}
        currentViewLayout={currentViewLayout}
        onViewLayoutChangeClick={this.handleViewLayoutChange} />
    );

    const mainList = (
      <LayoutContainer>
        <LayoutHeader>{responsiveToolbar}</LayoutHeader>
        <LayoutContent>{paginatedItems}</LayoutContent>
      </LayoutContainer>
    );

    let master;

    if (sortedSubscriptions.length > 0) {
      if (entries.isLoading) {
        master = <LoadingTeaser toolbar={responsiveToolbar} />;  
      } else if (!entries.isLoading) {
        if (entries.listedIds.length > 0) {
          master = mainList;
        } else {
          master = <NothingLeftToReadTeaser toolbar={responsiveToolbar} onRefresh={this.handleRefresh} />;
        }
      }
    }

    return (
      <MasterDetail
        master={master}
        detail={this.props.children}
        expandMaster={React.Children.count(this.props.children) === 0}
        pathname={this.props.pathname}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    sortedSubscriptions: getSortedSubscriptions(state),
    entries: state.entries,
    currentEntry: getCurrentEntry(state, ownProps),
    sortedEntries: getSortedEntries(state),
    pathname: ownProps.location.pathname,
    location: ownProps.location
  };
}

const dispatchToProps = { ...entriesActions, ...commonActions };

export default connect(mapStateToProps, dispatchToProps)(EntryListContainer);
