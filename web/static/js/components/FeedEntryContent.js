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
    this.initTimer(entry);

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
      this.initTimer(nextProps.entry);
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

  initTimer(entry) {
    if (this.timeout) clearTimeout(this.timeout);

    if (entry.unread) {
      this.timeout = setTimeout(() => {
        if (this.props.onEntryShown) this.props.onEntryShown(entry);
      }, 2000);
    }
  }

  rawContent() {
    return { __html: this.props.entry.content };
  }

  render() {
    const { entry } = this.props;

    return (
      <div className="feed-entry-content">
        <div className="feed-entry-content__header">
          <h2 className="title">
            <a href={entry.url} target="_blank">{entry.title}</a>
          </h2>
        </div>
        <div className="feed-entry-content__subheader">
          {entry.subscription_title} by {entry.author} / {entry.published}
        </div>
        <div className="feed-entry-content__content" dangerouslySetInnerHTML={this.rawContent()}/>
      </div>
    );
  }
}

export default FeedEntryContent;
