import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";

import { findScrollableAncestor } from "../utils/dom";

class FeedEntryContent extends Component {

  static propTypes = {
    entry: PropTypes.object,
    onEntryShown: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.shouldScrollToTop = false;
  }

  componentDidMount() {
    const { entry } = this.props;

    this.scrollableAncestor = findScrollableAncestor(ReactDOM.findDOMNode(this));
    this.initTimer();

    if (entry) this.updateLinksWithTargetBlank();
  }

  componentDidUpdate() {
    const { entry } = this.props;

    if (entry && this.shouldScrollToTop) {
      this.scrollableAncestor.scrollTop = 0;
      this.shouldScrollToTop = false;
    }

    if (entry) this.updateLinksWithTargetBlank();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry.id !== this.props.entry.id) {
      this.shouldScrollToTop = true;
      this.initTimer();
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  updateLinksWithTargetBlank() {
    const anchors = ReactDOM.findDOMNode(this).getElementsByTagName("a");
    for (let i=0; i<anchors.length; i++) {
      anchors[i].setAttribute("target", "_blank");
    }
  }

  initTimer() {
    if (this.timeout) clearTimeout(this.timeout);

    if (this.props.entry.unread) {
      this.timeout = setTimeout(() => {
        if (this.props.onEntryShown) this.props.onEntryShown(this.props.entry);
      }, 2000);
    }
  }

  rawContent() {
    return { __html: this.props.entry.content };
  }

  render() {
    return (
      <div className="feed-entry-content">
        <div className="feed-entry-content__header">
          <h2 className="title">
            <a href={this.props.entry.url} target="_blank">{this.props.entry.title}</a>
          </h2>
        </div>
        <div className="feed-entry-content__subheader">
          {this.props.entry.feed.title} by {this.props.entry.author} / {this.props.entry.published}
        </div>
        <div className="feed-entry-content__content" dangerouslySetInnerHTML={this.rawContent()}/>
      </div>
    );
  }
}

export default FeedEntryContent;
