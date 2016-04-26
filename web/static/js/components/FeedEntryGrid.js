import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import FeedEntryGridItem from "./FeedEntryGridItem";

class FeedEntryGrid extends Component {

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
    const cls = classNames("entry-grid", className);

    return (
      <div className={cls}>
        {entries.map((entry) => {
          return (
            <FeedEntryGridItem
              entry={entry}
              isSelected={entry && currentEntry && entry.id === currentEntry.id}
              key={entry.id}
              ref={entry.id}
              onClick={() => onEntryClick(entry)}
              className="entry-grid__item"/>);
        })}
      </div>
    );
  }
}

export default FeedEntryGrid;
