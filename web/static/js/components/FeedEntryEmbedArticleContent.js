import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";

import { findScrollableAncestor } from "../utils/dom";
import axios from "../utils/APIHelper";

class FeedEntryEmbedArticleContent extends Component {

  static propTypes = {
    entry: PropTypes.object,
    onEntryShown: PropTypes.func.isRequired,
    onLoadingStart: PropTypes.func,
    onLoadingComplete: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { entryArticle: "" };

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
      if (this.props.onLoadingStart) this.props.onLoadingStart();

      axios.get(`/api/entry_articles/${nextProps.entry.id}`)
        .then((response) => {
          console.log("success", response.data)
          this.setState({ entryArticle: response.data.entry_article });
          if (this.props.onLoadingComplete) this.props.onLoadingComplete();
        })
        .catch((response) => {
          console.log("error", response.data)
          if (this.props.onLoadingComplete) this.props.onLoadingComplete();
        });

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
    return { __html: this.state.entryArticle.content };
  }

  render() {
    const { entry } = this.props;

    return (
      <div className="feed-entry-content">
          <div>
            <div className="feed-entry-content__header">
              <h2 className="title">
                <a href={entry.url} target="_blank">{entry.title}</a>
              </h2>
            </div>
            <div className="feed-entry-content__subheader">
              {entry.subscription_title} by {entry.author} / {entry.published}
            </div>
            <div
              className="feed-entry-content__content"
              dangerouslySetInnerHTML={this.rawContent()}/>
          </div>
      </div>
    );
  }
}

export default FeedEntryEmbedArticleContent;