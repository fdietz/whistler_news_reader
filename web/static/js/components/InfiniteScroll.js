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
    this.scrollableAncestor = this.refs.scrollContainer;
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
    return (
      <div ref="scrollContainer" className={this.props.className}>
        {this.props.children}
      </div>
    )
  }

  handleScrollEvent() {
    if (!this.props.hasMore) {
      return;
    }

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

}
