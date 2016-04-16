import React, {Component, PropTypes} from "react";
import shallowCompare from "react-addons-shallow-compare";
import { routerActions } from "react-router-redux";
import { Link } from "react-router";
import classNames from "classnames";
import debounce from "lodash.debounce";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import {
  HouseSVGIcon,
  ListSVGIcon,
  PlusSVGIcon,
  ArrowDownSVGIcon,
  ArrowUpSVGIcon
} from "../components/SVGIcon";

import Button from "../components/Button";
import DropdownTrigger from "../components/DropdownTrigger";
import DropdownContent from "../components/DropdownContent";
import Dropdown from "../components/Dropdown";

import Feed from "./sidebar/Feed";
import Category from "./sidebar/Category";
import CategoryDropTarget from "./sidebar/CategoryDropTarget";
import FeedDragSource from "./sidebar/FeedDragSource";

import { bindHotKey, unbindHotKey } from "../utils/HotKeys";

class Sidebar extends Component {

  static propTypes = {
    feeds: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    currentPathname: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired,
    feedsActions: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onNextClick = this.onNextClick.bind(this);
    this.onPreviousClick = this.onPreviousClick.bind(this);
    this.debouncedOnNextClick = debounce(this.onNextClick, 100);
    this.debouncedOnPreviousClick = debounce(this.onPreviousClick, 100);

    this.onAddClick = this.onAddClick.bind(this);
    this.onSignOutClick = this.onSignOutClick.bind(this);
    this.onCategoryExpandClick = this.onCategoryExpandClick.bind(this);
    this.onNewCategoryClick = this.onNewCategoryClick.bind(this);
    this.handleOnFeedDrop = this.handleOnFeedDrop.bind(this);
    this.onOPMLImportClick = this.onOPMLImportClick.bind(this);
  }

  renderFeed(feed) {
    const { currentPathname } = this.props;
    const path = `/feeds/${feed.id}`;
    const key = `feeds-${feed.id}`;
    const active = path === currentPathname;

    // const cls = classNames({ "sidebar-nav-list__name": true, active: active });
    // const listItemCls = classNames({ active: active, "sidebar-nav-list__item": true });

    return (
      <Feed
        key={key}
        feed={feed}
        active={active}/>
    );
    // return (
    //   <FeedDragSource
    //     key={key}
    //     className={listItemCls}
    //     feed={feed}
    //     active={active}
    //     onDrop={this.handleOnFeedDrop}>
    //     <div className="sidebar-nav-list__meta">
    //       <div className="icon-placeholder"></div>
    //       <Link to={path} className={cls} title={feed.title}>{feed.title}</Link>
    //       {feed.unread_count > 0 &&
    //         <Badge count={feed.unread_count} className="sidebar-nav-list__badge"/>
    //       }
    //     </div>
    //   </FeedDragSource>
    // );
  }

  renderLink(label, path, iconName) {
    const { currentPathname } = this.props;
    const key = path;
    const active = path === currentPathname;

    const cls = classNames({ "sidebar-nav-list__name": true, active: active });
    const listItemCls = classNames({ active: active, "sidebar-nav-list__item": true });
    const currentColor = active ? "white" : "gray";

    return (
      <li className={listItemCls} key={key}>
        <div className="sidebar-nav-list__meta">
          {React.createElement(iconName, { color: currentColor })}
          <Link to={path} className={cls}>{label}</Link>
        </div>
      </li>
    );
  }

  renderCategory(category, feeds) {
    const { currentPathname } = this.props;
    const path = `/categories/${category.id}`;
    const key = `category-${category.id}`;
    const active = path === currentPathname;
    const matchingFeeds = feeds.filter((feed) => feed.category_id === category.id);
    const totalUnreadCount = matchingFeeds.reduce((result, feed) => {
      return result + feed.unread_count;
    }, 0);

    // const cls = classNames({ "sidebar-nav-list__name": true, active: active });
    // const listItemCls = classNames({ active: active, "sidebar-nav-list__item": true });
    // const currentColor = active ? "white" : "gray";

    return (
      <Category
        key={key}
        category={category}
        active={active}
        totalUnreadCount={totalUnreadCount}
        onExpandClick={this.onCategoryExpandClick}>
         {matchingFeeds.length > 0 && category.expanded &&
           <div className="sidebar-nav-list nested">
             {matchingFeeds.map((feed) => {
               return this.renderFeed(feed);
             })}
           </div>
         }
      </Category>
    );
    // return (
    //   <CategoryDropTarget key={key} className={listItemCls} category={category} active={active}>
    //     <div className="sidebar-nav-list__meta">
    //       <a
    //         href="#"
    //         className="sidebar-nav-list__expand-toggle"
    //         onClick={this.onCategoryExpandClick.bind(this, category)}>
    //         {category.expanded && <ArrowDownBoldSVGIcon color={currentColor}/>}
    //         {!category.expanded && <ArrowRightBoldSVGIcon color={currentColor}/>}
    //      </a>
    //      <Link to={path} className={cls} title={category.title}>{category.title}</Link>
    //      {totalUnreadCount > 0 &&
    //        <Badge count={totalUnreadCount} className="sidebar-nav-list__badge"/>
    //      }
    //     </div>
    //
    //     {matchingFeeds.length > 0 && category.expanded &&
    //       <div className="sidebar-nav-list nested">
    //         {matchingFeeds.map((feed) => {
    //           return this.renderFeed(feed);
    //         })}
    //       </div>
    //     }
    //   </CategoryDropTarget>
    // );
  }

  renderAddCategoryLink() {
    return (
      <li className="sidebar-nav-list__item" key="addCategory">
        <div className="sidebar-nav-list__meta">
          <PlusSVGIcon color="gray"/>
          <a
            href="#"
            className="sidebar-nav-list__name action"
            onClick={this.onNewCategoryClick}
            title="Add new category">Category</a>
        </div>
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
    bindHotKey("nextFeed", () => this.debouncedOnNextClick());
    bindHotKey("previousFeed", () => this.debouncedOnPreviousClick());
  }

  componentWillUnmount() {
    unbindHotKey("nextFeed");
    unbindHotKey("previousFeed");
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  onNextClick() {
    if (this.currentPathIndex+1 < this.paths.length) {
      const path = this.paths[this.currentPathIndex+1];
      routerActions.push(path);
    }
  }

  onPreviousClick() {
    if (this.currentPathIndex-1 >= 0) {
      const path = this.paths[this.currentPathIndex-1];
      routerActions.push(path);
    }
  }

  onAddClick(e) {
    e.preventDefault();
    this.props.modalsActions.openNewFeedModal();
  }

  onSignOutClick(event) {
    event.preventDefault();
    this.props.userActions.requestSignOut();
  }

  onOPMLImportClick(event) {
    event.preventDefault();
    this.props.modalsActions.openOpmlImportModal();
  }

  onCategoryExpandClick(category, event) {
    event.preventDefault();
    const { categoriesActions } = this.props;
    categoriesActions.toggleExpandCategory({ id: category.id });
  }

  onNewCategoryClick(event) {
    event.preventDefault();
    this.props.modalsActions.openNewCategoryModal();
  }

  handleOnFeedDrop(feedId, categoryId) {
    const { feedsActions } = this.props;
    feedsActions.requestUpdateFeedCategory(feedId, categoryId).then(() => {
      routerActions.push(`/feeds/${feedId}`);
    });
  }

  render() {
    const { feeds, categories, currentUser } = this.props;
    const feedsWithoutCategory = feeds.filter((feed) => !feed.category_id);

    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">whistle'r</div>
          <div className="subtitle">news reader</div>
        </div>
        <div className="sidebar-content">
          <div className="sidebar-actions">
            <Button
              onClick={this.onAddClick}
              type="primary"
              expand={true}
              title="Add new Subscription">+ Subscriptions</Button>
          </div>

          <div className="sidebar-nav-list">
            {this.renderLink("Today", "/today", HouseSVGIcon)}
            {this.renderLink("All", "/all", ListSVGIcon)}
          </div>

          <div className="sidebar-nav-list">
            {categories.map((category) => {
              return this.renderCategory(category, feeds);
            })}
            {feedsWithoutCategory.map((feed) => {
              return this.renderFeed(feed);
            })}
            {this.renderAddCategoryLink()}
          </div>
        </div>
        <div className="sidebar-footer">
          <div className="avatar">
            <img src={currentUser.image_url}/>
          </div>
          <div className="meta">
            <div className="user-name">{currentUser.name}</div>
            <div className="user-email">{currentUser.email}</div>
          </div>

          <Dropdown className="north west mx-l-auto">
            <DropdownTrigger className="btn btn-outline">
              <ArrowDownSVGIcon color="light-gray" size="medium" className="arrow-down"/>
            <ArrowUpSVGIcon color="light-gray" size="medium" className="arrow-up"/>
            </DropdownTrigger>
            <DropdownContent>
              <ul className="dropdown__list">
                <li className="dropdown__list-item">
                  <a href="#" onClick={this.onOPMLImportClick}>OPML Import</a>
                </li>
                <li className="dropdown__list-item">
                  <a href="#" onClick={this.onSignOutClick}>Logout</a>
                </li>
              </ul>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    );
  }
}

// export default DragDropContext(HTML5Backend)(Sidebar);
export default Sidebar;
