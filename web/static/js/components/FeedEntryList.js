import React, { PropTypes } from "react";
import FeedEntry from "./FeedEntry";

const FeedEntryList = ({ entries, currentEntry, onEntryClick }) => {
  return (
    <div className="item-list">
      {entries.map((entry, key) => {
        return (
          <FeedEntry
            {...entry}
            isSelected={entry && currentEntry && entry.id === currentEntry.id}
            key={key}
            onClick={() => onEntryClick(entry)} />);
      })}
    </div>
  );
};

FeedEntryList.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired
  })).isRequired,
  currentEntry: PropTypes.shape({
    id: PropTypes.number.isRequired
  }),
  onEntryClick: PropTypes.func.isRequired
};

export default FeedEntryList;
