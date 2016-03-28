import React, {Component, PropTypes} from "react";
import { Link } from "react-router";
import classNames from "classnames";
import debounce from "lodash.debounce";

import Icon from "../components/Icon";
import Badge from "../components/Badge";
import imageProfile from "../../assets/images/profile.jpg";

import { bindHotKey, unbindHotKey } from "../utils/HotKeys";

// import imageArrowDown from "../../assets/images/arrow-down.svg";
// import imageArrowUp from "../../assets/images/arrow-up.svg";
// import imageProfile from "../../assets/images/profile.jpg";

class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    currentPathname: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onSignOutClick: PropTypes.func.isRequired,
    onNextClick: PropTypes.func.isRequired,
    onPreviousClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.onNextClick = debounce(this.onNextClick.bind(this), 100);
    this.onPreviousClick = debounce(this.onPreviousClick.bind(this), 100);
  }

  renderRemoveableLink(feed, index) {
    const { currentPathname, onRemoveClick } = this.props;
    const key = index || feed.title;
    const path = `/feeds/${feed.id}`;

    let cls = classNames({
      active: path === currentPathname
    });

    return (
      <li className="sidebar-nav-list__item" key={key}>
        <Link to={path} className={cls} title={feed.title}>{feed.title}</Link>
        <a href="#" className="removable" onClick={onRemoveClick.bind(this, feed)}>
          <Icon name="cross" size="small"/>
        </a>
        {feed.unread_count > 0 && <Badge count={feed.unread_count}/>}
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
      <li className="sidebar-nav-list__item" key={key}>
        <Link to={path} className={cls}>{label}</Link>
      </li>
    );
  }

  componentDidUpdate() {
    const { currentPathname, feeds } = this.props;

    this.paths = ["/today", "/all"];
    this.paths = [...this.paths, ...feeds.map((feed) => `/feeds/${feed.id}`)];
    this.currentPathIndex = this.paths.indexOf(currentPathname);
  }

  componentDidMount() {
    bindHotKey("nextFeed", () => this.onNextClick());
    bindHotKey("previousFeed", () => this.onPreviousClick());
  }

  componentWillUnmount() {
    unbindHotKey("nextFeed");
    unbindHotKey("previousFeed");
  }

  onNextClick() {
    if (this.currentPathIndex+1 < this.paths.length) {
      const path = this.paths[this.currentPathIndex+1];
      this.props.onNextClick(path);
    }
  }

  onPreviousClick() {
    if (this.currentPathIndex-1 >= 0) {
      const path = this.paths[this.currentPathIndex-1];
      this.props.onPreviousClick(path);
    }
  }

  render() {
    const { feeds, currentUser, onSignOutClick } = this.props;

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
          <div className="meta">
            <div className="author">{currentUser.first_name} {currentUser.last_name}</div>
            <a onClick={onSignOutClick}>Logout</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Sidebar;
