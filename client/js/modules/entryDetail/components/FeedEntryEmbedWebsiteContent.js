import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { findScrollableAncestor } from '../../../utils/dom';
import FeedEntryHeader from './FeedEntryHeader';
import FeedEntrySubheader from './FeedEntrySubheader';

class FeedEntryEmbedWebsiteContent extends Component {

  static propTypes = {
    entry: PropTypes.object,
    onEntryShown: PropTypes.func.isRequired,
    onLoadingStart: PropTypes.func,
    onLoadingComplete: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.shouldScrollToTop = false;

    this.onLoad = this.onLoad.bind(this);
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
      if (this.props.onLoadingStart) this.props.onLoadingStart();
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
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
    return { __html: this.props.entry.content };
  }

  onLoad() {
    if (this.props.onLoadingComplete) this.props.onLoadingComplete();
  }

  render() {
    const { entry } = this.props;

    return (
      <div className="feed-entry-content website">
        <iframe
          src={entry.url}
          onLoad={this.onLoad}
          className="entry-embed-site"
    />
      </div>
    );
  }
}

export default FeedEntryEmbedWebsiteContent;
