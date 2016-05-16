import React, { PropTypes } from 'react';
import classNames from 'classnames';

import Icon from 'components/Icon';
import { CheckmarkSVGIcon, TrashSVGIcon, CycleSVGIcon, CogSVGIcon,
  ArrowDownSVGIcon, ArrowUpSVGIcon, MenuSVGIcon, EllipsisSVGIcon } from 'components/SVGIcon';

import Button from 'components/Button';
import ButtonGroup from 'components/ButtonGroup';
import DropdownTrigger from 'components/DropdownTrigger';
import DropdownContent from 'components/DropdownContent';
import Dropdown from 'components/Dropdown';

const EntryListToolbarMobile = ({
  currentViewLayout,
  showSpinner,
  isSubscriptionSelected,
  isCategorySelected,
  title,
  onMarkAsReadClick,
  onRefreshEntriesClick,
  onRemoveFeedOrCategoryClick,
  onViewLayoutChangeClick,
  onOpenEditFeedOrCategoryModalClick,
  onToggleSidebarClick,
}) => {
  const spinnerCls = classNames({
    spinner: true,
    hide: !showSpinner,
  });

  const editFeedOrCategoryCls = classNames('dropdown__list-item', {
    disabled: !isSubscriptionSelected && !isCategorySelected,
  });

  return (
    <div className="toolbar toolbar--titled show-small-screen-only">
      <Button
        type="header"
        onClick={onToggleSidebarClick}
        title="Mark all stories as read">
        <MenuSVGIcon color="white" size="small" />
      </Button>
      <header>
        <div className="title">{title}</div>
        <span className={spinnerCls}>
          <Icon name="spinner" size="small" />
        </span>
      </header>
      <div className="right">
        <Button
          type="header"
          onClick={onRefreshEntriesClick}
          title="Fetch new stories">
          <CycleSVGIcon color="white" size="small" />
        </Button>
        <Dropdown className="west">
          <DropdownTrigger className="btn btn-header">
            <EllipsisSVGIcon color="white" size="small" />
          </DropdownTrigger>
          <DropdownContent >
            <ul className="dropdown__list">
              <li className="dropdown__list-item">
                <a
                  onClick={onMarkAsReadClick}
                  title="Mark all stories as read">
                  <CheckmarkSVGIcon color="white" size="small" />
                  Mark all as read
                </a>
              </li>
              <li className="dropdown__list-separator" />
              <li
                className="dropdown__list-item"
                onClick={onViewLayoutChangeClick.bind(this, 'list')}>
                <input
                  type="radio"
                  id="list"
                  name="currrent_view_layout"
                  checked={currentViewLayout === 'list'}
                  readOnly
                  className="dropdown-field media" />
                <label
                  htmlFor="list"
                  className="dropdown-label content" >List</label>
              </li>
              <li
                className="dropdown__list-item"
                onClick={onViewLayoutChangeClick.bind(this, 'compact_list')}>
                <input
                  type="radio"
                  id="compact_list"
                  name="currrent_view_layout"
                  checked={currentViewLayout === 'compact_list'}
                  readOnly
                  className="dropdown-field media" />
                <label
                  htmlFor="compact_list"
                  className="dropdown-label
                  content">Compact List</label>
              </li>
              <li
                className="dropdown__list-item"
                onClick={onViewLayoutChangeClick.bind(this, 'grid')}>
                <input
                  type="radio"
                  id="grid"
                  name="currrent_view_layout"
                  checked={currentViewLayout === 'grid'}
                  readOnly
                  className="dropdown-field media" />
                <label
                  htmlFor="grid"
                  className="dropdown-label content">Grid (experimental)</label>
              </li>
              <li className="dropdown__list-separator" />
              <li
                className={editFeedOrCategoryCls}
                onClick={onOpenEditFeedOrCategoryModalClick}>
                <div className="media">
                  <CogSVGIcon color="white" size="small" />
                </div>
                <div className="content">Settings</div>
              </li>
              <li
                className={editFeedOrCategoryCls}
                onClick={onRemoveFeedOrCategoryClick}>
                <div className="media">
                  <TrashSVGIcon color="white" size="small" />
                </div>
                <div className="content">Delete</div>
              </li>
            </ul>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
};

EntryListToolbarMobile.propTypes = {
  title: PropTypes.string.isRequired,
  currentViewLayout: PropTypes.string.isRequired,
  showSpinner: PropTypes.bool.isRequired,
  isSubscriptionSelected: PropTypes.bool.isRequired,
  isCategorySelected: PropTypes.bool.isRequired,
  hasPreviousEntry: PropTypes.bool.isRequired,
  hasNextEntry: PropTypes.bool.isRequired,
  onMarkAsReadClick: PropTypes.func.isRequired,
  onRefreshEntriesClick: PropTypes.func.isRequired,
  onRemoveFeedOrCategoryClick: PropTypes.func.isRequired,
  onViewLayoutChangeClick: PropTypes.func.isRequired,
  onOpenEditFeedOrCategoryModalClick: PropTypes.func.isRequired,
  onPreviousEntryClick: PropTypes.func.isRequired,
  onNextEntryClick: PropTypes.func.isRequired,
  onOpenExternalClick: PropTypes.func.isRequired,
};

export default EntryListToolbarMobile;
