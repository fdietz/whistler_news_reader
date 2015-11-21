import React, {Component, PropTypes} from "react";
import FeedEntry from "./HalfWidthFeedEntry";

export default class HalfWidthFeedEntryList extends Component {

  static propTypes = {
    entries: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className="half-width-item-list">
        {this.props.entries.map(function(entry, i) {
          return (<FeedEntry entry={entry} key={i} />);
        })}
      </div>
    );
  }
}
