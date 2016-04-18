import React, { Component, PropTypes } from "react";
import { DragSource } from "react-dnd";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";

import { Link } from "react-router";
import Badge from "../Badge";

class FeedDragSource extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    feed: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      unread_count: PropTypes.number.isRequired
    }).isRequired,
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onDrop: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { feed, active } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    const cls = classNames("sidebar-nav-list__item", {
      active: active
    });

    const linkCls = classNames("sidebar-nav-list__name", {
      active: active
    });

    const path = `/feeds/${feed.id}`;

    return connectDragSource(
      <div className={cls} style={{ opacity }}>
        <div className="sidebar-nav-list__meta">
          <div className="icon-placeholder"></div>
          <Link to={path} className={linkCls} title={feed.title}>{feed.title}</Link>
          {feed.unread_count > 0 &&
            <Badge count={feed.unread_count} className="sidebar-nav-list__badge"/>
          }
        </div>
      </div>
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

export default DragSource(ItemTypes.FEED, feedSource, collect)(FeedDragSource);
