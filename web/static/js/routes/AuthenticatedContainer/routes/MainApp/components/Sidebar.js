import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { Link } from 'react-router';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import {
  ArrowDownSVGIcon,
  ArrowUpSVGIcon,
} from 'components/SVGIcon';

import DropdownTrigger from 'components/DropdownTrigger';
import DropdownContent from 'components/DropdownContent';
import Dropdown from 'components/Dropdown';

import {
  HouseSVGIcon,
  ListSVGIcon,
  PlusSVGIcon,
  GoBackSVGIcon,
} from 'components/SVGIcon';

import Button from 'components/Button';

import CategoryDropTarget from './CategoryDropTarget';
import SubscriptionDragSource from './SubscriptionDragSource';

import { bindHotKey, unbindHotKey } from 'utils/HotKeys';

class Sidebar extends Component {

  static propTypes = {
    sidebar: PropTypes.object.isRequired,
    subscriptions: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
    currentPathname: PropTypes.string.isRequired,
    currentUser: PropTypes.object.isRequired,
    userActions: PropTypes.object.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    sidebarActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired,
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

    this.onOPMLImportClick = this.onOPMLImportClick.bind(this);
    this.onSignOutClick = this.onSignOutClick.bind(this);
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
        path={path}
        active={active}
        onDrop={this.handleOnFeedDrop}
        onLinkClick={sidebarActions.hideSidebar}
    />
    );
  }

  renderLink(label, path, iconName) {
    const { currentPathname } = this.props;
    const key = path;
    const active = currentPathname.startsWith(path);

    const cls = classNames({ 'sidebar-nav-list__name': true, active: active });
    const listItemCls = classNames({ active: active, 'sidebar-nav-list__item': true });
    const currentColor = active ? 'white' : 'gray';

    return (
      <li className={listItemCls} key={key}>
        <div className="sidebar-nav-list__meta">
          {React.createElement(iconName, { color: currentColor })}
          <Link
            onClick={this.props.sidebarActions.hideSidebar}
            to={path}
            className={cls}
    >{label}</Link>
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
        path={path}
        active={active}
        totalUnreadCount={totalUnreadCount}
        onExpandClick={this.onCategoryExpandClick}
        onLinkClick={sidebarActions.hideSidebar}
    >
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
          <PlusSVGIcon color="gray" />
          <a
            href="#"
            className="sidebar-nav-list__name action"
            onClick={this.onNewCategoryClick}
            title="Add new category"
    >Category</a>
        </div>
      </li>
    );
  }

  componentDidMount() {
    bindHotKey('nextFeed', () => this.debouncedOnNextClick());
    bindHotKey('previousFeed', () => this.debouncedOnPreviousClick());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidUpdate() {
    const { currentPathname, subscriptions } = this.props;

    this.paths = ['/today', '/all'];
    this.paths = [
      ...this.paths,
      ...subscriptions.map((subscription) => `/subscriptions/${subscription.id}`)
    ];
    this.currentPathIndex = this.paths.indexOf(currentPathname);
  }

  componentWillUnmount() {
    unbindHotKey('nextFeed');
    unbindHotKey('previousFeed');
  }

  onNextClick() {
    const { routerActions } = this.props;

    if (this.currentPathIndex + 1 < this.paths.length) {
      const path = this.paths[this.currentPathIndex + 1];
      routerActions.push(path);
    }
  }

  onPreviousClick() {
    const { routerActions } = this.props;

    if (this.currentPathIndex - 1 >= 0) {
      const path = this.paths[this.currentPathIndex - 1];
      routerActions.push(path);
    }
  }

  onAddClick(e) {
    e.preventDefault();
    this.props.sidebarActions.hideSidebar();
    this.props.routerActions.push({ pathname: '/feeds/new', state: { modal: true } });
  }

  onCategoryExpandClick(category, event) {
    event.preventDefault();
    const { categoriesActions } = this.props;
    categoriesActions.updateCategory({ id: category.id, expanded: !category.expanded });
  }

  onNewCategoryClick(event) {
    event.preventDefault();
    this.props.sidebarActions.hideSidebar();
    this.props.routerActions.push({ pathname: '/categories/new', state: { modal: true } });
  }

  handleOnFeedDrop(subscriptionId, categoryId) {
    const { routerActions } = this.props;

    const { subscriptionsActions } = this.props;
    subscriptionsActions.requestUpdateSubscription(
      subscriptionId, { category_id: categoryId }).then(() => {
        routerActions.push(`/subscriptions/${subscriptionId}/entries`);
      });
  }

  onSignOutClick(event) {
    event.preventDefault();
    this.props.userActions.requestSignOut();
  }

  onOPMLImportClick(event) {
    event.preventDefault();
    this.props.routerActions.push({ pathname: '/opml_import', state: { modal: true } });
  }

  render() {
    const { currentUser, subscriptions, categories, sidebar } = this.props;
    const { sidebarActions, userActions, routerActions } = this.props;

    const subscriptionsWithoutCategory = subscriptions.filter(subscription =>
      !subscription.category_id);

    const sidebarCls = classNames('sidebar', {
      hidden: !sidebar.isVisible,
      visible: sidebar.isVisible,
    });

    return (
      <div className={sidebarCls} ref="sidebar">
        <div className="sidebar-header">
          <div className="logo">whistle'r</div>
          <div className="subtitle">
            <span>n</span>
            <span>e</span>
            <span>w</span>
            <span>s</span>
          </div>
        </div>
        <div className="sidebar-content scrollbar">
          <div className="sidebar-actions">
            <Button
              onClick={this.onAddClick}
              type="primary"
              expand
              title="Add new Subscription">
              <PlusSVGIcon size="small" color="white" />
              Subscriptions
            </Button>
          </div>

          <div className="sidebar-nav-list">
            {this.renderLink('Today', '/today/entries', HouseSVGIcon)}
            {this.renderLink('All', '/all/entries', ListSVGIcon)}
          </div>

          <div className="sidebar-nav-list">
            {categories.map((category) =>
              this.renderCategory(category, subscriptions)
            )}
            {subscriptionsWithoutCategory.map((subscription) =>
              this.renderSubscription(subscription)
            )}
            {this.renderAddCategoryLink()}
          </div>
        </div>
        <div className="sidebar-footer hide-large-screen2">
          <div className="avatar-square">
            <img src={currentUser.image_url} />
          </div>
          <Dropdown className="north ml1">
            <DropdownTrigger className="mr1">
              <div className="user-email">{currentUser.email}</div>
              <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down" />
              <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up" />
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

export default DragDropContext(HTML5Backend)(Sidebar);
