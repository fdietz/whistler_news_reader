import React, {Component, PropTypes} from "react";
import classNames from "classnames";
import DateTimeHelper from "../utils/DateTimeHelper";

export default class FeedEntry extends Component {

  static propTypes = {
    published: PropTypes.string.isRequired,
    feed: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    unread: PropTypes.bool.isRequired,
    summary: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  publishedRelativeDateTime() {
    let date = new Date(this.props.published);
    return DateTimeHelper.timeDifference(date);
  }

  render() {
    const { isSelected, onClick, feed, title, summary, unread } = this.props;
    let cls = classNames({
      item: true,
      selected: isSelected,
      unread: unread
    });

    return (
      <div className={cls} onClick={onClick}>
        <div className="item-row">
          <div className="meta">
            <div className="feed-title">{feed.title}</div>
            <span className="circle"></span>
            <span className="published">{this.publishedRelativeDateTime()}</span>
          </div>
          <div className="entry-title">{title}</div>
          <div className="entry-summary">{summary}</div>
        </div>
      </div>
    );
  }
}
