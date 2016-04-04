import React, { Component, PropTypes } from "react";
import { DragSource } from "react-dnd";

class Feed extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    feed: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onDrop: PropTypes.func.isRequired
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { className, children } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div className={className} style={{ opacity }}>
          {children}
        </div>
      )
    );
  }
}

const ItemTypes = {
  FEED: "feed"
};

const feedSource = {
  beginDrag(props) {
    return {
      title: props.feed.title,
      id: props.feed.id
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.onDrop(props.feed.id, dropResult.id);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

export default DragSource(ItemTypes.FEED, feedSource, collect)(Feed);
