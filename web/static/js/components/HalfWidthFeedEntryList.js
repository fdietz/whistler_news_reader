import React, {Component, PropTypes} from "react";
import HalfWidthFeedEntry from "./HalfWidthFeedEntry";

export default class HalfWidthFeedEntryList extends Component {

  static propTypes = {
    entries: PropTypes.array.isRequired,
    currentEntry: PropTypes.object,
    // todos: PropTypes.arrayOf(PropTypes.shape({
    //   text: PropTypes.string.isRequired,
    //   completed: PropTypes.bool.isRequired
    // }).isRequired).isRequired
    onEntryClick: PropTypes.func.isRequired
  };

  render() {
    const { onEntryClick, currentEntry } = this.props;

    return (
      <div className="half-width-item-list">
        {this.props.entries.map(function(entry, i) {
          let isSelected = (entry && currentEntry && entry.guid === currentEntry.guid) || false;
          return (
            <HalfWidthFeedEntry
              entry={entry}
              isSelected={isSelected}
              key={i}
              onClick={() => onEntryClick(entry)} />);
        })}
      </div>
    );
  }
}
