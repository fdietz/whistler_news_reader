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
    onRemoveCategoryClick: PropTypes.func,
    onFeedDrop: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.onNextClick = debounce(this.onNextClick.bind(this), 100);
    this.onPreviousClick = debounce(this.onPreviousClick.bind(this), 100);
    this.onAddClick = this.onAddClick.bind(this);
  }

  renderFeed(feed, index) {
    const { currentPathname, onRemoveClick, onFeedDrop } = this.props;
    const path = `/feeds/${feed.id}`;
    const active = path === currentPathname;

    const cls = classNames({
      active: path === currentPathname
    });

    const listItemCls = classNames({
      active: path === currentPathname,
      "sidebar-nav-list__item": true
    });

    return (
      <Feed className={listItemCls} {...feed} active={active} onDrop={onFeedDrop}>
        <Link to={path} className={cls} title={feed.title}>{feed.title}</Link>
        <a href="#" className="removable" onClick={onRemoveClick.bind(this, feed)}>
          <Icon name="cross" size="small"/>
        </a>
        {feed.unread_count > 0 && <Badge count={feed.unread_count}/>}
      </Feed>
    );
  }

  renderLink(label, path, index = null) {
    const { currentPathname } = this.props;
    const key = index || label;

    const cls = classNames({
      active: path === currentPathname
    });

    const listItemCls = classNames({
      active: path === currentPathname,
      "sidebar-nav-list__item": true
    });

    return (
      <li className={listItemCls} key={key}>
        <Link to={path} className={cls}>{label}</Link>
      </li>
    );
  }

  renderCategory(category, feeds) {
    const { currentPathname, onRemoveCategoryClick } = this.props;
    const path = `/categories/${category.id}`;
    const active = path === currentPathname;

    const cls = classNames({
      active: path === currentPathname
    });

    const listItemCls = classNames({
      active: path === currentPathname,
      "sidebar-category-list__item": true
    });

    const matchingFeeds = feeds.filter((feed) => feed.category_id === category.id);
    return (
      <Category className={listItemCls} {...category} active={active}>
        <div className="meta">
         <Icon name="arrow-right4" size="small"/>
         <Link to={path} className={cls} title={category.title}>{category.title}</Link>
         <a href="#" className="removable" onClick={onRemoveCategoryClick.bind(this, category)}>
           <Icon name="cross" size="small"/>
         </a>
         {category.unread_count > 0 && <Badge count={category.unread_count}/>}
        </div>

        {matchingFeeds.length > 0 &&
         <div className="sidebar-nav-list">
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
          <h4 className="sidebar-nav-header">Home</h4>
          <div className="sidebar-nav-list">
            {this.renderLink("Today", "/today")}
            {this.renderLink("All", "/all")}
          </div>

          <h4 className="sidebar-nav-header">
            Subscriptions
          </h4>
          <div className="sidebar-category-list">
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
