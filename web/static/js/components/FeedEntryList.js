import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import FeedEntryListItem from "./FeedEntryListItem";

class FeedEntryList extends Component {

  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired,
    currentEntry: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    onEntryClick: PropTypes.func.isRequired,
    className: PropTypes.string
  };

  render() {
    const { entries, currentEntry, onEntryClick, className } = this.props;
    const cls = classNames("entry-list", className);

    return (
      <div className={cls}>
        {entries.map((entry) => {
          return (
            <FeedEntryListItem
              {...entry}
              isSelected={entry && currentEntry && entry.id === currentEntry.id}
              key={entry.id}
              ref={entry.id}
              onClick={() => onEntryClick(entry)}/>
          );
        })}
      </div>
    );
  }
}

export default FeedEntryList;
