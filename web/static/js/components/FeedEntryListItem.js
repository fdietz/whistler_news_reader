import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import shallowCompare from "react-addons-shallow-compare";

import DateTimeHelper from "../utils/DateTimeHelper";

class FeedEntryListItem extends Component {

  static propTypes = {
    entry: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    className: PropTypes.string
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      entry,
      isSelected = false,
      onClick,
      className
    } = this.props;

    let cls = classNames("entry-list__item", className, {
      selected: isSelected,
      unread: entry.unread
    });

    const date = new Date(entry.published);
    const relativeDateTime = DateTimeHelper.timeDifference(date);

    return (
      <div className={cls} onClick={() => onClick(entry)}>
        <div className="entry-title">{entry.title}</div>
        <div className="entry-summary">{entry.summary}</div>
        <div className="meta">
          <div className="feed-title">{entry.subscription_title}</div>
          <span className="circle"></span>
          <span className="published">{relativeDateTime}</span>
        </div>
      </div>
    );
  }
}

export default FeedEntryListItem;
