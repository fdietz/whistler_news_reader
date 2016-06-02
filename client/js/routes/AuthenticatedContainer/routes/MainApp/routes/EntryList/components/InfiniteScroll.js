import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { findScrollableAncestor } from 'utils/dom';

export default class InfiniteScroll extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    hasMore: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
  };

  static defaultProps = {
    hasMore: true,
    threshold: 250,
  }

  constructor(props) {
    super(props);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  componentDidMount() {
    this.scrollableAncestor = findScrollableAncestor(ReactDOM.findDOMNode(this));
    this.attachScrollListener();
    this.handleScrollEvent();
  }

  componentDidUpdate() {
    this.detachScrollListener();
    this.detachResizeListener();

    this.attachScrollListener();
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    this.detachScrollListener();
    this.detachResizeListener();
  }

  handleScrollEvent() {
    if (!this.props.hasMore) return;

    const scrollTop = this.scrollableAncestor.scrollTop;
    const scrollHeight = this.scrollableAncestor.scrollHeight;
    const offsetHeight = this.scrollableAncestor.offsetHeight;

    // check for scrollHeight !== 0 in case component is hidden via CSS
    if (scrollHeight !== 0 && scrollTop + offsetHeight + this.props.threshold > scrollHeight) {
      if (this.props.loadMore) this.props.loadMore();
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore) return;
    this.scrollableAncestor.addEventListener('scroll', this.handleScrollEvent);
  }

  detachScrollListener() {
    this.scrollableAncestor.removeEventListener('scroll', this.handleScrollEvent);
  }

  attachResizeListener() {
    window.addEventListener('resize', this.handleScrollEvent);
  }

  detachResizeListener() {
    window.removeEventListener('resize', this.handleScrollEvent);
  }

  render() {
    return (
      <div ref="scrollContainer" className="infinite-scroll-container">
        {this.props.children}
      </div>
    );
  }

}
