import React, {Component, PropTypes} from "react";
import FeedEntry from "./FeedEntry";

class FeedEntryList extends Component {

  static propTypes = {
    entries: PropTypes.array.isRequired
  };

  render() {
    return (
      <div className="item-list">
        {this.props.entries.map(function(entry, i) {
          return (<FeedEntry entry={entry} key={i} />);
        })}
      </div>
    );
  }
}

export default FeedEntryList;
