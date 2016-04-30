import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import FeedEntryListItem from './FeedEntryListItem';

class FeedEntryList extends Component {

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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
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
            <FeedEntryListItem
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

export default FeedEntryList;
