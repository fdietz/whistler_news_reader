import React, {Component, PropTypes} from "react";
import FeedEntry from "./HalfWidthFeedEntry";

export default class HalfWidthFeedEntryList extends Component {

  static propTypes = {
    entries: PropTypes.array.isRequired,
    // todos: PropTypes.arrayOf(PropTypes.shape({
    //   text: PropTypes.string.isRequired,
    //   completed: PropTypes.bool.isRequired
    // }).isRequired).isRequired
    onEntryClick: PropTypes.func.isRequired
  };

  render() {
    const { onEntryClick } = this.props;

    return (
      <div className="half-width-item-list">
        {this.props.entries.map(function(entry, i) {
          return (
            <FeedEntry
              entry={entry}
              key={i}
              onClick={() => onEntryClick(entry)} />);
        })}
      </div>
    );
  }
}
