import React, {Component, PropTypes} from "react";
import classNames from "classnames";

export default class HalfWidthFeedEntry extends Component {

  static propTypes = {
    entry: PropTypes.object.isRequired
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
    return (
      <div className="half-width-item">
        <div className="half-width-item-row">
          <div className="primary-title">{this.props.entry.feed.title}</div>
          <div className="secondary-title">{this.props.entry.title}</div>
          <div className="secondary-summary">{this.props.entry.summary}</div>
          <span className="secondary-published">{this.publishedRelativeDateTime()}</span>
        </div>
      </div>
    );
  }
}
