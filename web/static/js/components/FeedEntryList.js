import React, {Component, PropTypes} from "react";
import FeedEntry from "./FeedEntry";

export default class FeedEntryList extends Component {

  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    })).isRequired,
    currentEntry: PropTypes.shape({
      id: PropTypes.number.isRequired
    }),
    // todos: PropTypes.arrayOf(PropTypes.shape({
    //   text: PropTypes.string.isRequired,
    //   completed: PropTypes.bool.isRequired
    // }).isRequired).isRequired
    onEntryClick: PropTypes.func.isRequired
  };

  render() {
    const { onEntryClick, currentEntry } = this.props;

    return (
      <div className="item-list">
        {this.props.entries.map(function(entry, i) {
          let isSelected = (entry && currentEntry && entry.id === currentEntry.id) || false;
          return (
            <FeedEntry
              {...entry}
              isSelected={isSelected}
              key={i}
              onClick={() => onEntryClick(entry)} />);
        })}
      </div>
    );
  }
}
