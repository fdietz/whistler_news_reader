import React, { PropTypes, Component } from "react";
import { DropTarget } from "react-dnd";

export class Category extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    className: PropTypes.string.isRequired
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const { id, className, children } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor;
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

    return connectDropTarget(
      <div key={id} style={{ backgroundColor }} className={className}>
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
      id: props.id,
      title: props.title
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
