import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { findScrollableAncestor } from '../../../utils/dom';
import FeedEntryHeader from './FeedEntryHeader';
import FeedEntrySubheader from './FeedEntrySubheader';
import axios from '../../../utils/APIHelper';

class FeedEntryEmbedArticleContent extends Component {

  static propTypes = {
    entry: PropTypes.object,
    onEntryShown: PropTypes.func.isRequired,
    onLoadingStart: PropTypes.func,
    onLoadingComplete: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = { entryArticle: '' };

    this.shouldScrollToTop = false;
  }

  componentDidMount() {
    const { entry } = this.props;

    this.scrollableAncestor = findScrollableAncestor(ReactDOM.findDOMNode(this));

    if (entry) {
      this.loadContent(entry).then(() => {
        this.updateLinksWithTargetBlank();
        this.initTimer(entry);
      });
    }
  }

  componentDidUpdate() {
    const { entry } = this.props;

    if (entry && this.shouldScrollToTop) {
      this.scrollableAncestor.scrollTop = 0;
      this.shouldScrollToTop = false;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry.id !== this.props.entry.id) {
      this.shouldScrollToTop = true;
      if (nextProps.onLoadingStart) nextProps.onLoadingStart();

      this.loadContent(nextProps.entry).then(() => {
        this.updateLinksWithTargetBlank();
        this.initTimer(nextProps.entry);
      });
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  loadContent(entry) {
    return axios.get(`/api/entry_articles/${entry.id}`)
      .then((response) => {
        this.setState({ entryArticle: response.data.entry_article });
        if (this.props.onLoadingComplete) this.props.onLoadingComplete();
      })
      .catch(() => {
        if (this.props.onLoadingComplete) this.props.onLoadingComplete();
      });
  }

  updateLinksWithTargetBlank() {
    const anchors = ReactDOM.findDOMNode(this).getElementsByTagName('a');
    for (let i = 0; i < anchors.length; i++) {
      anchors[i].setAttribute('target', '_blank');
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
        <FeedEntryHeader {...entry} />
        <FeedEntrySubheader {...entry} />
        <div
          className="feed-entry-content__content"
          dangerouslySetInnerHTML={this.rawContent()} />
      </div>
    );
  }
}

export default FeedEntryEmbedArticleContent;
