import React, { Component, PropTypes } from "react";
import { DragSource } from "react-dnd";

export class Feed extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    unread_count: PropTypes.number.isRequired,
    className: PropTypes.string.isRequired,
    onDrop: PropTypes.func.isRequired
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { id, className, children } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return (
      connectDragSource(
        <div className={className} key={id} style={{ opacity }}>
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
      title: props.title,
      id: props.id
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.onDrop(props.id, dropResult.id);
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
