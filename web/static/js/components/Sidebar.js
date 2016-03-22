import React, {Component, PropTypes} from "react";
import { Link } from "react-router";
import classNames from "classnames";

import imageProfile from "../../assets/images/profile.jpg";

// import imageArrowDown from "../../assets/images/arrow-down.svg";
// import imageArrowUp from "../../assets/images/arrow-up.svg";
// import imageProfile from "../../assets/images/profile.jpg";

class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    currentPathname: PropTypes.string.isRequired,
    onRemoveClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderRemoveableLink(feed, index) {
    const { currentPathname, onRemoveClick } = this.props;
    const key = index || feed.title;
    const path = `/feeds/${feed.id}`;

    let cls = classNames({
      active: path === currentPathname
    });

    return (
      <li className="sidebar-nav-list-item" key={key}>
        <Link to={path} className={cls} title={feed.title}>{feed.title}</Link>
        <a href="#" className="removable" onClick={onRemoveClick.bind(this, feed)}>x</a>
      </li>
    );
  }

  renderLink(label, path, index = null) {
    const { currentPathname } = this.props;
    const key = index || label;

    let cls = classNames({
      active: path === currentPathname
    });

    return (
      <li className="sidebar-nav-list-item" key={key}>
        <Link to={path} className={cls}>{label}</Link>
      </li>
    );
  }

  render() {
    const { feeds } = this.props;

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">whistle'r</div>
        </div>
        <div className="sidebar-content">
          <h4 className="sidebar-nav-header">Home</h4>
          <ul className="sidebar-nav-list">
            {this.renderLink("Today", "/today")}
            {this.renderLink("All", "/all")}
          </ul>

          <h4 className="sidebar-nav-header">Subscriptions</h4>
          <ul className="sidebar-nav-list">
            {feeds.map((feed, index) => {
              return this.renderRemoveableLink(feed, index);
            })}
          </ul>
        </div>
        <div className="sidebar-footer">
          <div className="avatar">
            <img src={imageProfile}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
