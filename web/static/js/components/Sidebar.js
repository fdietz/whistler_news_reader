import React, {Component, PropTypes} from "react";
import { Link } from "react-router";
import classNames from "classnames";
import debounce from "lodash.debounce";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Icon from "../components/Icon";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Category from "../components/Category";
import Feed from "../components/Feed";
import imageProfile from "../../assets/images/profile.jpg";

import { bindHotKey, unbindHotKey } from "../utils/HotKeys";

class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    currentPathname: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onSignOutClick: PropTypes.func.isRequired,
    onNextClick: PropTypes.func.isRequired,
    onPreviousClick: PropTypes.func.isRequired,
    onRemoveCategoryClick: PropTypes.func.isRequired,
    onCategoryExpandClick: PropTypes.func.isRequired,
    onFeedDrop: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.onNextClick = debounce(this.onNextClick.bind(this), 100);
    this.onPreviousClick = debounce(this.onPreviousClick.bind(this), 100);
    this.onAddClick = this.onAddClick.bind(this);
  }

  renderFeed(feed) {
    const { currentPathname, onRemoveClick, onFeedDrop } = this.props;
    const path = `/feeds/${feed.id}`;
    const active = path === currentPathname;

    const cls = classNames({ "sidebar-list-name": true, active: active });
    const listItemCls = classNames({ active: active, "sidebar-nav-list__item": true });

    return (
      <Feed className={listItemCls} {...feed} active={active} onDrop={onFeedDrop}>
        <div className="sidebar-list-meta">
          <div className="icon-placeholder"></div>
          <Link to={path} className={cls} title={feed.title}>{feed.title}</Link>
          <a href="#" className="sidebar-list-removable" onClick={onRemoveClick.bind(this, feed)}>
            <Icon name="cross" size="small"/>
          </a>
          {feed.unread_count > 0 && <Badge count={feed.unread_count} className="sidebar-list-badge"/>}
        </div>
      </Feed>
    );
  }

  renderLink(label, path, iconName) {
    const { currentPathname } = this.props;
    const key = path;
    const active = path === currentPathname;

    const cls = classNames({ "sidebar-list-name": true, active: active });
    const listItemCls = classNames({ active: active, "sidebar-nav-list__item": true });

    return (
      <li className={listItemCls} key={key}>
        <div className="sidebar-list-meta">
          <Icon name={iconName} size="small"/>
          <Link to={path} className={cls}>{label}</Link>
        </div>
      </li>
    );
  }

  renderCategory(category, feeds) {
    const { currentPathname, onRemoveCategoryClick, onCategoryExpandClick } = this.props;
    const path = `/categories/${category.id}`;
    const active = path === currentPathname;
    const matchingFeeds = feeds.filter((feed) => feed.category_id === category.id);
    const totalUnreadCount = matchingFeeds.reduce((result, feed) => {
      return result + feed.unread_count;
    }, 0);

    const cls = classNames({ "sidebar-list-name": true, active: active });
    const listItemCls = classNames({ active: active, "sidebar-nav-list__item": true });

    return (
      <Category className={listItemCls} {...category} active={active}>
        <div className="sidebar-list-meta">
          <a href="#" onClick={onCategoryExpandClick.bind(this, category)}>
            {category.expanded &&
              <Icon name="arrow-down" size="small"/>
            }
            {!category.expanded &&
              <Icon name="arrow-right4" size="small"/>
            }
         </a>
         <Link to={path} className={cls} title={category.title}>{category.title}</Link>
         <a href="#" className="sidebar-list-removable" onClick={onRemoveCategoryClick.bind(this, category)}>
           <Icon name="cross" size="small"/>
         </a>
         {totalUnreadCount > 0 && <Badge count={totalUnreadCount} className="sidebar-list-badge"/>}
        </div>

        {matchingFeeds.length > 0 && category.expanded &&
          <div className="sidebar-nav-list nested">
            {matchingFeeds.map((feed) => {
              return this.renderFeed(feed);
            })}
          </div>
        }
      </Category>
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

  onAddClick(e) {
    e.preventDefault();
    this.props.onAddClick();
  }

  render() {
    const { feeds, categories, currentUser, onSignOutClick } = this.props;
    const feedsWithoutCategory = feeds.filter((feed) => !feed.category_id);

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">whistle'r</div>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <Button
              onClick={this.onAddClick}
              type="primary"
              expand={true}>+ Subscriptions</Button>
          </div>
          {/*<h4 className="sidebar-nav-header">Home</h4>*/}
          <div className="sidebar-nav-list">
            {this.renderLink("Today", "/today", "house")}
            {this.renderLink("All", "/all", "list")}
          </div>

          {/*<h4 className="sidebar-nav-header">
            Subscriptions
          </h4>*/}
          <div className="sidebar-nav-list">
            {categories.map((category) => {
              return this.renderCategory(category, feeds);
            })}
            {feedsWithoutCategory.map((feed) => {
              return this.renderFeed(feed);
            })}
          </div>
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

export default DragDropContext(HTML5Backend)(Sidebar);
