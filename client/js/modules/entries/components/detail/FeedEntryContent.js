import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { findScrollableAncestor } from '../../../../utils/dom';
import FeedEntryHeader from './FeedEntryHeader';
import FeedEntrySubheader from './FeedEntrySubheader';

class FeedEntryContent extends Component {

  static propTypes = {
    entry: PropTypes.object,
    onEntryShown: PropTypes.func.isRequired,
    onLoadingStart: PropTypes.func,
    onLoadingComplete: PropTypes.func,
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.entry.id !== this.props.entry.id) {
      this.shouldScrollToTop = true;
      this.initTimer(nextProps.entry);
    }
  }

  componentDidUpdate() {
    const { entry } = this.props;

    if (entry && this.shouldScrollToTop) {
      this.scrollableAncestor.scrollTop = 0;
      this.shouldScrollToTop = false;
    }

    if (entry) this.updateLinksWithTargetBlank();
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

export default FeedEntryContent;
