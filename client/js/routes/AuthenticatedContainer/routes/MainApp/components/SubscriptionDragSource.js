import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

import { Link } from 'react-router';
import Badge from 'components/Badge';

class SubscriptionDragSource extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    subscription: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      unread_count: PropTypes.number.isRequired,
    }).isRequired,
    path: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    className: PropTypes.string,
    onDrop: PropTypes.func.isRequired,
    onLinkClick: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { subscription, active, onLinkClick, path } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    const cls = classNames('sidebar-nav-list__item', {
      active: active,
    });

    const linkCls = classNames('sidebar-nav-list__name', {
      active: active,
    });

    return connectDragSource(
      <div className={cls} style={{ opacity }}>
        <div className="sidebar-nav-list__meta">
          <div className="icon-placeholder"></div>
          <Link
            onClick={onLinkClick}
            to={path}
            className={linkCls}
            title={subscription.title}
    >{subscription.title}</Link>
          {subscription.unread_count > 0 &&
            <Badge count={subscription.unread_count} className="sidebar-nav-list__badge" />
          }
        </div>
      </div>
    );
  }
}

const ItemTypes = {
  SUBSCRIPTION: 'subscription',
};

const subscriptionSource = {
  beginDrag(props) {
    return {
      title: props.subscription.title,
      id: props.subscription.id,
    };
  },

  endDrag(props, monitor) {
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.onDrop(props.subscription.id, dropResult.id);
    }
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(ItemTypes.SUBSCRIPTION, subscriptionSource, collect)(SubscriptionDragSource);
