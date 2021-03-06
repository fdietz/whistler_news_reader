import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

import { Link } from 'react-router';
import Badge from '../../../components/Badge';
import {
  ArrowRightBoldSVGIcon,
} from '../../../components/SVGIcon';

class CategoryDropTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      expanded: PropTypes.bool.isRequired,
    }).isRequired,
    path: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    onExpandClick: PropTypes.func.isRequired,
    totalUnreadCount: PropTypes.number,
    onLinkClick: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const {
      category,
      active,
      totalUnreadCount,
      onExpandClick,
      children,
      onLinkClick,
      path
    } = this.props;
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor;
    if (isActive) {
      backgroundColor = 'rgba(0,0,0,0.5)';
    }

    const cls = classNames('sidebar-nav-list__item', { active });

    const linkCls = classNames('sidebar-nav-list__name', { active });

    const toggleCls = classNames('sidebar-nav-list__expand-toggle', {
      expanded: category.expanded,
    });

    const currentColor = active ? 'white' : 'gray';

    return connectDropTarget(
      <div className={cls} style={{ backgroundColor }}>
        <div className="sidebar-nav-list__meta">
          <a
            className={toggleCls}
            onClick={onExpandClick.bind(this, category)}>
            <ArrowRightBoldSVGIcon color={currentColor} />
          </a>
          <Link
            onClick={onLinkClick}
            to={path}
            className={linkCls}
            title={category.title}>{category.title}</Link>
         {totalUnreadCount > 0 &&
           <Badge count={totalUnreadCount} className="sidebar-nav-list__badge" />
         }
        </div>
        {children}
      </div>
    );
  }
}

const ItemTypes = {
  SUBSCRIPTION: 'subscription',
};

const categoryTarget = {
  drop(props) {
    return {
      id: props.category.id,
      title: props.category.title,
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

/* eslint new-cap: 0 */
export default DropTarget(ItemTypes.SUBSCRIPTION, categoryTarget, collect)(CategoryDropTarget);
