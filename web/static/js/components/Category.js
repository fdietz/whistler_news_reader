import React, { PropTypes, Component } from "react";
import { DropTarget } from "react-dnd";

class Category extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    active: PropTypes.bool.isRequired,
    className: PropTypes.string
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { className, children } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor;
    if (isActive) {
      backgroundColor = "rgba(0,0,0,0.5)";
    }

    return connectDropTarget(
      <div style={{ backgroundColor }} className={className}>
        {children}
      </div>
    );
  }
}

const ItemTypes = {
  FEED: "feed"
};

const categoryTarget = {
  drop(props) {
    return {
      id: props.category.id,
      title: props.category.title
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

export default DropTarget(ItemTypes.FEED, categoryTarget, collect)(Category);
