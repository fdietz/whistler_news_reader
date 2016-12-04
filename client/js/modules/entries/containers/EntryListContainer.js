import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Media from 'react-media';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import LayoutHeader from '../../../layouts/LayoutHeader';
import LayoutContent from '../../../layouts/LayoutContent';
import LayoutContainer from '../../../layouts/LayoutContainer';
import LayoutMasterPage from '../../../layouts/LayoutMasterPage';
import LayoutDetailPage from '../../../layouts/LayoutDetailPage';

import InfiniteScroll from '../components/InfiniteScroll';
import EntryList from '../components/list/EntryList';
import EntryGrid from '../components/grid/EntryGrid';

import EntryListToolbarContainer from './EntryListToolbarContainer';

import NoMoreContent from '../components/NoMoreContent';
import WelcomeTeaser from '../components/WelcomeTeaser';
import NothingLeftToReadTeaser from '../components/NothingLeftToReadTeaser';
import NoArticleSelectedTeaser from '../components/NoArticleSelectedTeaser';

import * as EntriesActions from '../actions';
import * as CommonActions from '../../../actions';

import {
  getSortedSubscriptions,
  getSortedEntries,
  getHasPreviousEntry,
  getHasNextEntry,
  getPreviousEntryId,
  getNextEntryId,
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
    hasPreviousEntry: PropTypes.bool.isRequired,
    hasNextEntry: PropTypes.bool.isRequired,
    previousEntryId: PropTypes.number,
    nextEntryId: PropTypes.number,

    sortedSubscriptions: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.node,

    // actions
    entriesActions: PropTypes.object.isRequired,
    commonActions: PropTypes.object.isRequired
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
    const { entriesActions } = this.props;

    entriesActions.requestFetchEntries(this.requestParams(this.props))
      .then(() => {
        this.firstEntry();
      });
  }

  componentWillReceiveProps(nextProps) {
    const { entriesActions } = this.props;

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
        entriesActions.requestFetchEntries(np);
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
    const { commonActions, params, pathname } = this.props;
    commonActions.navigateToEntry(entryId, params, pathname);
  }

  handleSelectCurrentEntry(entry) {
    this.navigateTo(entry.id);
  }

  handleViewLayoutChange(value) {
    this.setState({ currentViewLayout: value });
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
    const { currentViewLayout } = this.state;
    const {
      entries,
      sortedEntries,
      sortedSubscriptions,
      currentEntry,
    } = this.props;
    const { entriesActions } = this.props;

    let items;
    if (currentViewLayout === 'list' || currentViewLayout === 'compact_list') {
      items = (
        <EntryList
          entries={sortedEntries}
          currentEntry={currentEntry}
          onEntryClick={e => this.handleSelectCurrentEntry(e)}
          className={currentViewLayout === 'compact_list' ? 'compact' : ''}
      />
      );
    } else if (currentViewLayout === 'grid') {
      items = (
        <EntryGrid
          entries={sortedEntries}
          currentEntry={currentEntry}
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

    const hasChildren = React.Children.count(this.props.children) > 0;

    const masterListCls = classNames('layout-master-page', {
      grid: currentViewLayout === 'grid',
      'hide-animation': hasChildren
    });

    const responsiveToolbar = (
      <EntryListToolbarContainer
        params={this.props.params}
        pathname={this.props.pathname}
        currentViewLayout={currentViewLayout}
        onViewLayoutChangeClick={this.handleViewLayoutChange} />
    );

    const mainList = (
      <LayoutMasterPage className={masterListCls}>
        <LayoutContainer>
          <LayoutHeader>{responsiveToolbar}</LayoutHeader>
          <LayoutContent>{paginatedItems}</LayoutContent>
        </LayoutContainer>
      </LayoutMasterPage>
    );

    const segment = this.props.pathname.split('/')[2];

    return (
      <div className="layout-master-container">
        {sortedSubscriptions.length > 0 && entries.listedIds.length > 0 && mainList}

        {!hasChildren && sortedSubscriptions.length === 0 &&
          <LayoutDetailPage>
            <WelcomeTeaser toolbar={responsiveToolbar} />
          </LayoutDetailPage>
        }

        {!hasChildren && sortedSubscriptions.length > 0 && entries.listedIds.length > 0 &&
          <Media query="(max-width: 40em)">
            {function match(matches) {
              return matches ? null :
                <LayoutDetailPage><NoArticleSelectedTeaser /></LayoutDetailPage>;
            }}
          </Media>
        }

        {sortedSubscriptions.length > 0 && entries.listedIds.length === 0 &&
          <LayoutDetailPage>
            <NothingLeftToReadTeaser toolbar={responsiveToolbar} onRefresh={this.handleRefresh} />
          </LayoutDetailPage>
        }

        <Media query="(max-width: 40em)">
          {
            matches => {
              if (matches) {
                return (<ReactCSSTransitionGroup
                  component="div"
                  className="slide-animation-container"
                  transitionName="slide-left"
                  transitionEnterTimeout={200}
                  transitionLeaveTimeout={200}>
                  {hasChildren && React.cloneElement(this.props.children, {
                    key: segment
                  })}
                </ReactCSSTransitionGroup>);
              } else if (hasChildren) {
                return this.props.children;
              }

              return null;
            }
          }
        </Media>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    sortedSubscriptions: getSortedSubscriptions(state),
    entries: state.entries,
    currentEntry: state.entries.byId[ownProps.params.id],
    hasPreviousEntry: getHasPreviousEntry(state, ownProps),
    hasNextEntry: getHasNextEntry(state, ownProps),
    previousEntryId: getPreviousEntryId(state, ownProps),
    nextEntryId: getNextEntryId(state, ownProps),
    sortedEntries: getSortedEntries(state),
    pathname: ownProps.location.pathname,
    location: ownProps.location
  };
}

function mapDispatchToProps(dispatch) {
  return {
    entriesActions: bindActionCreators(EntriesActions, dispatch),
    commonActions: bindActionCreators(CommonActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryListContainer);
