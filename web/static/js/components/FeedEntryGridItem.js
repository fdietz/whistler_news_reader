import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import DateTimeHelper from "../utils/DateTimeHelper";

class FeedEntryGridItem extends Component {

  static propTypes = {
    published: PropTypes.string.isRequired,
    feed: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    unread: PropTypes.bool.isRequired,
    summary: PropTypes.string,
    content: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool,
    className: PropTypes.string
  };

  extractUrl(str) {
    let m;
    let urls = [];
    const rex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;

    while (m = rex.exec(str)) {
      urls.push(m[1]);
    }

    return urls[0];
  }

  render() {
    const { title, published, content, unread, summary, isSelected = false, onClick, feed, className } = this.props;

    let cls = classNames("item", className, {
      selected: isSelected,
      unread: unread
    });

    const date = new Date(published);
    const relativeDateTime = DateTimeHelper.timeDifference(date);
    const imageUrl = this.extractUrl(content);

    return (
      <div className={cls} onClick={onClick}>
        <img src={imageUrl} alt="image"/>
        <div className="caption">
          <div className="entry-title">{title}</div>
          <div className="meta">
            <div className="feed-title">{feed.title}</div>
            <span className="circle"></span>
            <span className="published">{relativeDateTime}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default FeedEntryGridItem;
