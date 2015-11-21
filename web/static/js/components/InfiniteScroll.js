import React, {Component} from "react";
import ReactDOM from "react-dom";

export default class InfiniteScroll extends Component {

  constructor(props) {
    super(props);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  static defaultProps = {
    hasMore: true,
    loadMore: function () {},
    threshold: 250
  }

  componentDidMount() {
    this.scrollableAncestor = this._findScrollableAncestor();
    this.attachScrollListener();
    this.handleScrollEvent();
    window.addEventListener('resize', this.handleScrollEvent);
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  componentDidUpdate() {
    this.handleScrollEvent();
  }

  render() {
    let props = this.props;
    return React.DOM.div(null, props.children, props.hasMore && (props.loader));
  }

  handleScrollEvent() {
    if (!this.props.hasMore) {
      return;
    }

    let el = ReactDOM.findDOMNode(this);

    let scrollTop    = this.scrollableAncestor.scrollTop;
    let scrollHeight = this.scrollableAncestor.scrollHeight;
    let offsetHeight = this.scrollableAncestor.offsetHeight;

    if (scrollTop + offsetHeight + this.props.threshold > scrollHeight) {
      this.props.loadMore();
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore) {
      console.log("hasMore == false")
      return;
    }

    this.scrollableAncestor.addEventListener("scroll", this.handleScrollEvent);
  }

  detachScrollListener() {
    this.scrollableAncestor.removeEventListener("scroll", this.handleScrollEvent);
  }

  componentWillUnmount() {
    this.detachScrollListener();
    window.removeEventListener('resize', this.handleScrollEvent);
  }

  _findScrollableAncestor() {
    let node = ReactDOM.findDOMNode(this);

    while (node.parentNode) {
      node = node.parentNode;

      if (node === document || node === document.documentElement) {
        continue;
      }

      const style = window.getComputedStyle(node);
      const overflowY = style.getPropertyValue("overflow-y") ||
        style.getPropertyValue("overflow");

      if (overflowY === "auto" || overflowY === "scroll") {
        return node;
      }
    }

    // fallback window
    return window;
  }

}
