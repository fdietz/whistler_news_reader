import React, {Component, PropTypes} from "react";
import { Link } from "react-router";
import classNames from "classnames";

// import imageArrowDown from "../../assets/images/arrow-down.svg";
// import imageArrowUp from "../../assets/images/arrow-up.svg";
// import imageProfile from "../../assets/images/profile.jpg";

class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    onAddFeedClick: PropTypes.func.isRequired,
    currentPathname: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderFeedLink(feed, index) {
    const feedLink = `/feeds/${feed.id}`;
    return this.renderLink(feed.title, feedLink, index);
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
    const { feeds, onAddFeedClick } = this.props;

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">whistle'r</div>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <button onClick={onAddFeedClick}
              className="btn btn-primary bg-blue btn-expand">Add Feed</button>
          </div>

          <h4 className="sidebar-nav-header">Home</h4>
          <ul className="sidebar-nav-list">
            {this.renderLink("Today", "/today")}
            {this.renderLink("All", "/all")}
          </ul>

          <h4 className="sidebar-nav-header">Subscriptions</h4>
          <ul className="sidebar-nav-list">
            {feeds.map((feed, index) => {
              return this.renderFeedLink(feed, index);
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Sidebar;
