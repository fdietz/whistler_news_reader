import React, {Component, PropTypes} from "react";
import classNames from "classnames";

export default class FeedEntry extends Component {

  static propTypes = {
    entry: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
  }

  timeDifference(previous) {
    const current = new Date();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed/1000) + "sec";
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed/msPerMinute) + "m";
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed/msPerHour) + "h";
    } else if (elapsed < msPerMonth) {
      return (previous.getMonth()+1) + "/" + previous.getDay() + "/" + previous.getFullYear();
    }
  }

  publishedRelativeDateTime() {
    let date = new Date(this.props.entry.published);
    return this.timeDifference(date);
  }

  render() {
    const { isSelected, onClick, entry } = this.props;
    let cls = classNames({
      item: true,
      selected: isSelected
    });

    return (
      <div className={cls} onClick={onClick}>
        <div className="item-row">
          <div className="meta">
            <div className="primary-title">{entry.feed.title}</div>
            <span className="secondary-published">{this.publishedRelativeDateTime()}</span>
          </div>
          <div className="secondary-title">{entry.title}</div>
          <div className="secondary-summary">{entry.summary}</div>
        </div>
      </div>
    );
  }
}
