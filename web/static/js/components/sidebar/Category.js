import React, {Component, PropTypes} from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import { Link } from "react-router";
import Badge from "../Badge";

import {
  ArrowDownBoldSVGIcon,
  ArrowRightBoldSVGIcon
} from "../SVGIcon";

class Category extends Component {

  static propTypes = {
    category: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    active: PropTypes.bool.isRequired,
    onExpandClick: PropTypes.func.isRequired,
    totalUnreadCount: PropTypes.number,
    children: PropTypes.node
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { category, active, totalUnreadCount, onExpandClick, children } = this.props;

    const cls = classNames("sidebar-nav-list__item", {
      active: active
    });

    const linkCls = classNames("sidebar-nav-list__name", {
      active: active
    });

    const path = `/categories/${category.id}`;
    const currentColor = active ? "white" : "gray";

    return (
      <div className={cls}>
        <div className="sidebar-nav-list__meta">
          <a
            href="#"
            className="sidebar-nav-list__expand-toggle"
            onClick={onExpandClick.bind(this, category)}>
            {category.expanded && <ArrowDownBoldSVGIcon color={currentColor}/>}
            {!category.expanded && <ArrowRightBoldSVGIcon color={currentColor}/>}
         </a>
         <Link to={path} className={linkCls} title={category.title}>{category.title}</Link>
         {totalUnreadCount > 0 &&
           <Badge count={totalUnreadCount} className="sidebar-nav-list__badge"/>
         }
        </div>
        {children}
      </div>

    );
  }
}

export default Category;
