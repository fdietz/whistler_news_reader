import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import DateTimeHelper from "../utils/DateTimeHelper";

class FeedEntryListItem extends Component {

  static propTypes = {
    published: PropTypes.string.isRequired,
    feed: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    unread: PropTypes.bool.isRequired,
    summary: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    className: PropTypes.string
  };

  render() {
    const { title, published, unread, summary, isSelected = false, onClick, feed, className } = this.props;

    let cls = classNames("item", className, {
      selected: isSelected,
      unread: unread
    });

    const date = new Date(published);
    const relativeDateTime = DateTimeHelper.timeDifference(date);

    return (
      <div className={cls} onClick={onClick}>
        <div className="item-row">
          <div className="meta">
            <div className="feed-title">{feed.title}</div>
            <span className="circle"></span>
            <span className="published">{relativeDateTime}</span>
          </div>
          <div className="entry-title">{title}</div>
          <div className="entry-summary">{summary}</div>
        </div>
      </div>
    );
  }
}

export default FeedEntryListItem;
