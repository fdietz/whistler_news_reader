import React, {Component, PropTypes} from "react";

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
    this.scrollableAncestor = this.refs.scrollContainer;
    this.attachScrollListener();
    this.handleScrollEvent();
    window.addEventListener("resize", this.handleScrollEvent);
  }

  componentDidUpdate() {
    this.attachScrollListener();
  }

  componentDidUpdate() {
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

}
