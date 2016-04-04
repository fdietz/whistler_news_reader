import React, { Component, PropTypes } from "react";

import FeedEntry from "./FeedEntry";

class FeedEntryList extends Component {

  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired,
    currentEntry: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    onEntryClick: PropTypes.func.isRequired
  };

  render() {
    const { entries, currentEntry, onEntryClick } = this.props;

    return (
      <div className="item-list">
        {entries.map((entry) => {
          return (
            <FeedEntry
              {...entry}
              isSelected={entry && currentEntry && entry.id === currentEntry.id}
              key={entry.id}
              ref={entry.id}
              onClick={() => onEntryClick(entry)} />);
        })}
      </div>
    );
  }
}

export default FeedEntryList;
