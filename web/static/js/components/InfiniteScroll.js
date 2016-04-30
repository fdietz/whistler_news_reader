import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { findScrollableAncestor } from '../utils/dom';

export default class InfiniteScroll extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    hasMore: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
  };

  static defaultProps = {
    hasMore: true,
    loadMore: function () {},
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

  render() {
    return (
      <div ref="scrollContainer" className="infinite-scroll-container">
        {this.props.children}
      </div>
    );
  }

  handleScrollEvent() {
    if (!this.props.hasMore) return;

    let scrollTop = this.scrollableAncestor.scrollTop;
    let scrollHeight = this.scrollableAncestor.scrollHeight;
    let offsetHeight = this.scrollableAncestor.offsetHeight;

    if (scrollTop + offsetHeight + this.props.threshold > scrollHeight) {
      this.props.loadMore();
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

  componentWillUnmount() {
    this.detachScrollListener();
    this.detachResizeListener();
  }

}
