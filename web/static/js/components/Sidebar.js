import React, {Component, PropTypes} from "react";
import shallowCompare from "react-addons-shallow-compare";
import { Link } from "react-router";
import classNames from "classnames";
import debounce from "lodash.debounce";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import {
  HouseSVGIcon,
  ListSVGIcon,
  PlusSVGIcon,
  GoBackSVGIcon
} from "../components/SVGIcon";

import Button from "../components/Button";

import CategoryDropTarget from "./sidebar/CategoryDropTarget";
import SubscriptionDragSource from "./sidebar/SubscriptionDragSource";

import { bindHotKey, unbindHotKey } from "../utils/HotKeys";

class Sidebar extends Component {

  static propTypes = {
    sidebar: PropTypes.object.isRequired,
    subscriptions: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    currentPathname: PropTypes.string.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    sidebarActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.onNextClick = this.onNextClick.bind(this);
    this.onPreviousClick = this.onPreviousClick.bind(this);
    this.debouncedOnNextClick = debounce(this.onNextClick, 100);
    this.debouncedOnPreviousClick = debounce(this.onPreviousClick, 100);

    this.onAddClick = this.onAddClick.bind(this);
    this.onCategoryExpandClick = this.onCategoryExpandClick.bind(this);
    this.onNewCategoryClick = this.onNewCategoryClick.bind(this);
    this.handleOnFeedDrop = this.handleOnFeedDrop.bind(this);
  }

  renderSubscription(subscription) {
    const { currentPathname, sidebarActions } = this.props;
    const path = `/subscriptions/${subscription.id}/entries`;
    const key = `subscriptions-${subscription.id}`;
    const active = currentPathname.startsWith(path);

    return (
      <SubscriptionDragSource
        key={key}
        subscription={subscription}
        active={active}
        onDrop={this.handleOnFeedDrop}
        onLinkClick={sidebarActions.hideSidebar}/>
    );
  }

  renderLink(label, path, iconName) {
    const { currentPathname } = this.props;
    const key = path;
    const active = currentPathname.startsWith(path);

    const cls = classNames({ "sidebar-nav-list__name": true, active: active });
    const listItemCls = classNames({ active: active, "sidebar-nav-list__item": true });
    const currentColor = active ? "white" : "gray";

    return (
      <li className={listItemCls} key={key}>
        <div className="sidebar-nav-list__meta">
          {React.createElement(iconName, { color: currentColor })}
          <Link
            onClick={this.props.sidebarActions.hideSidebar}
            to={path}
            className={cls}>{label}</Link>
        </div>
      </li>
    );
  }

  renderCategory(category, subscriptions) {
    const { currentPathname, sidebarActions } = this.props;
    const path = `/categories/${category.id}/entries`;
    const key = `category-${category.id}`;
    const active = currentPathname.startsWith(path);
    const matchingSubscriptions = subscriptions.filter((subscription) => subscription.category_id === category.id);
    const totalUnreadCount = matchingSubscriptions.reduce((result, subscription) => {
      return result + subscription.unread_count;
    }, 0);

    return (
      <CategoryDropTarget
        key={key}
        category={category}
        active={active}
        totalUnreadCount={totalUnreadCount}
        onExpandClick={this.onCategoryExpandClick}
        onLinkClick={sidebarActions.hideSidebar}>
         {matchingSubscriptions.length > 0 && category.expanded &&
           <div className="sidebar-nav-list nested">
             {matchingSubscriptions.map(subscription =>
               this.renderSubscription(subscription)
             )}
           </div>
         }
      </CategoryDropTarget>
    );
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
    const { currentPathname, subscriptions } = this.props;

    this.paths = ["/today", "/all"];
    this.paths = [...this.paths, ...subscriptions.map((subscription) => `/subscriptions/${subscription.id}`)];
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
    this.props.sidebarActions.hideSidebar();
    this.props.routerActions.push({ pathname: "/feeds/new", state: { modal: true } });
  }

  onCategoryExpandClick(category, event) {
    event.preventDefault();
    const { categoriesActions } = this.props;
    categoriesActions.updateCategory({ id: category.id, expanded: !category.expanded });
  }

  onNewCategoryClick(event) {
    event.preventDefault();
    this.props.sidebarActions.hideSidebar();
    this.props.routerActions.push({ pathname: "/categories/new", state: { modal: true } });
  }

  handleOnFeedDrop(subscriptionId, categoryId) {
    const { subscriptionsActions } = this.props;
    subscriptionsActions.requestUpdateSubscription(subscriptionId, { category_id: categoryId }).then(() => {
      routerActions.push(`/subscriptions/${subscriptionId}/entries`);
    });
  }

  render() {
    const { subscriptions, categories, sidebar, sidebarActions } = this.props;
    const subscriptionsWithoutCategory = subscriptions.filter(subscription => !subscription.category_id);

    const sidebarCls = classNames("sidebar", {
      hidden: !sidebar.isVisible,
      visible: sidebar.isVisible
    });

    return (
      <div className={sidebarCls} ref="sidebar">
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
            {this.renderLink("Today", "/today/entries", HouseSVGIcon)}
            {this.renderLink("All", "/all/entries", ListSVGIcon)}
          </div>

          <div className="sidebar-nav-list">
            {categories.map((category) => {
              return this.renderCategory(category, subscriptions);
            })}
            {subscriptionsWithoutCategory.map((subscription) => {
              return this.renderSubscription(subscription);
            })}
            {this.renderAddCategoryLink()}
          </div>
        </div>
        <div className="sidebar-footer hide-large-screen">
          <a href="#" onClick={sidebarActions.toggle} className="btn gray">
            <GoBackSVGIcon color="gray" size="small" className="mr1"/> Close
          </a>
        </div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(Sidebar);
