import React, {Component, PropTypes} from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import { Link } from "react-router";
import Badge from "../Badge";

class Feed extends Component {

  static propTypes = {
    feed: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired
    }).isRequired,
    active: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { feed, active } = this.props;

    const cls = classNames("sidebar-nav-list__item", {
      active: active
    });

    const linkCls = classNames("sidebar-nav-list__name", {
      active: active
    });

    const path = `/feeds/${feed.id}`;

    return (
      <div className={cls}>
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

export default Feed;
