import React, {Component, PropTypes} from "react";
import FeedEntryContent from "./FeedEntryContent";
import classNames from "classnames";

class FeedEntry extends Component {

  static propTypes = {
    entry: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { expanded: false };

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded });
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
    let content = null;

    if (this.state.expanded) {
      content = <FeedEntryContent entry={this.props.entry}/>;
    }

    let itemRowClass = classNames({
      item: true,
      expanded: this.state.expanded
    });

    return (
      <div className={itemRowClass}>
        <div className="item-row" onClick={this.toggleExpand}>
          <span className="primary-title">{this.props.entry.feed.title}</span>
          <span className="secondary-title">{this.props.entry.title}</span>
          <span className="secondary-summary">{this.props.entry.summary}</span>
          <span className="secondary-published">{this.publishedRelativeDateTime()}</span>
        </div>
        {content}
      </div>
    );
  }
}

export default FeedEntry;
