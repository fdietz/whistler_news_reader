import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import EntryListItem from './EntryListItem';

import { isElementInViewport } from 'utils/dom';

class EntryList extends Component {

  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
    })).isRequired,
    currentEntry: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
    onEntryClick: PropTypes.func.isRequired,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.handleOnEntryClick = this.handleOnEntryClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentEntry &&
        this.props.currentEntry &&
        nextProps.currentEntry.id !== this.props.currentEntry.id) {
      this.scrollIntoViewIfNeeded(nextProps.currentEntry.id);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  scrollIntoViewIfNeeded(entryId) {
    const dom = ReactDOM.findDOMNode(this.refs[entryId]);
    if (!isElementInViewport(dom)) {
      dom.scrollIntoView();
    }
  }

  handleOnEntryClick(entry) {
    this.props.onEntryClick(entry);
  }

  render() {
    const { entries, currentEntry, className } = this.props;
    const cls = classNames('entry-list', className);

    return (
      <div className={cls}>
        {entries.map((entry) => {
          return (
            <EntryListItem
              entry={entry}
              isSelected={entry && currentEntry && entry.id === currentEntry.id}
              key={entry.id}
              ref={entry.id}
              onClick={this.handleOnEntryClick}
          />
          );
        })}
      </div>
    );
  }
}

export default EntryList;
