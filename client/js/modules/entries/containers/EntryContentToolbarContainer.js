import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';
import Media from 'react-media';

import EntryContentToolbar from '../components/EntryContentToolbar';

import {
  getHasPreviousEntry,
  getHasNextEntry,
  getPreviousEntryId,
  getNextEntryId,
  getEnhancedEntry
} from '../../../redux/selectors';

import { entryPath, mapRequestParams, goBackPathname } from '../../../utils/navigator';

class EntryContentToolbarContainer extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired,
    pathname: PropTypes.string.isRequired,
    entry: PropTypes.object,
    currentViewMode: PropTypes.string.isRequired,
    showSpinner: PropTypes.bool.isRequired,
    hasPreviousEntry: PropTypes.bool.isRequired,
    hasNextEntry: PropTypes.bool.isRequired,
    onChangeViewModeClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);

    this.onOpenExternalClick = this.onOpenExternalClick.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
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

  onOpenExternalClick() {
    window.open(this.props.entry.url, '_blank');
  }

  onGoBackClick() {
    const { push, params, pathname } = this.props;

    push(goBackPathname(params, pathname));
  }

  navigateTo(entryId) {
    const { push, params, pathname } = this.props;
    push(entryPath(entryId, params, pathname));
  }

  requestParams(props) {
    const { params, pathname } = props;
    return mapRequestParams(params, pathname);
  }

  render() {
    const {
      entry,
      hasPreviousEntry,
      hasNextEntry,
      currentViewMode,
      showSpinner,
      onChangeViewModeClick
    } = this.props;

    return (
      <Media query="(max-width: 40em)">
        {
          (matches) => (
            <EntryContentToolbar
              isMobile={matches}
              entry={entry}
              currentViewMode={currentViewMode}
              showSpinner={showSpinner}
              hasPreviousEntry={hasPreviousEntry}
              hasNextEntry={hasNextEntry}
              onPreviousEntryClick={this.previousEntry}
              onNextEntryClick={this.nextEntry}
              onOpenExternalClick={this.onOpenExternalClick}
              onGoBackClick={this.onGoBackClick}
              onChangeViewModeClick={onChangeViewModeClick} />
          )
        }
      </Media>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    entry: getEnhancedEntry(state, ownProps),
    hasPreviousEntry: getHasPreviousEntry(state, ownProps),
    hasNextEntry: getHasNextEntry(state, ownProps),
    previousEntryId: getPreviousEntryId(state, ownProps),
    nextEntryId: getNextEntryId(state, ownProps)
  };
}

const dispatchToProps = {
  ...RouterActions
};

export default connect(mapStateToProps, dispatchToProps)(EntryContentToolbarContainer);
