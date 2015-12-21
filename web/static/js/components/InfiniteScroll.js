import React, {Component, PropTypes} from "react";
import ReactDOM from "react-dom";

export default class InfiniteScroll extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    hasMore: PropTypes.bool.isRequired,
    loadMore: PropTypes.func.isRequired,
    threshold: PropTypes.number.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    hasMore: true,
    loadMore: function () {},
    threshold: 250
  }

  constructor(props) {
    super(props);
    this.handleScrollEvent = this.handleScrollEvent.bind(this);
  }

  componentDidMount() {
    this.scrollableAncestor = this._findScrollableAncestor();
    this.attachScrollListener();
    this.handleScrollEvent();
    window.addEventListener("resize", this.handleScrollEvent);
  }

  componentDidUpdate() {
    this.attachScrollListener();
    this.handleScrollEvent();
  }

  render() {
    return (
      <div ref="scrollContainer" className={this.props.className}>
        {this.props.children}
      </div>
    );
  }

  handleScrollEvent() {
    if (!this.props.hasMore) return;

    let scrollTop    = this.scrollableAncestor.scrollTop;
    let scrollHeight = this.scrollableAncestor.scrollHeight;
    let offsetHeight = this.scrollableAncestor.offsetHeight;

    if (scrollTop + offsetHeight + this.props.threshold > scrollHeight) {
      this.props.loadMore();
    }
  }

  attachScrollListener() {
    if (!this.props.hasMore) return;
    this.scrollableAncestor.addEventListener("scroll", this.handleScrollEvent);
  }

  detachScrollListener() {
    this.scrollableAncestor.removeEventListener("scroll", this.handleScrollEvent);
  }

  componentWillUnmount() {
    this.detachScrollListener();
    window.removeEventListener("resize", this.handleScrollEvent);
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
