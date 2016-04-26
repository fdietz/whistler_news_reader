import React, { PropTypes } from "react";
import classNames from "classnames";

import Icon from "../components/Icon";
import { CheckmarkSVGIcon, TrashSVGIcon, CycleSVGIcon, ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon, EarthSVGIcon, ResizeEnlargeSVGIcon, CogSVGIcon,
  ArrowDownSVGIcon, ArrowUpSVGIcon, MenuSVGIcon } from "../components/SVGIcon";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import DropdownTrigger from "../components/DropdownTrigger";
import DropdownContent from "../components/DropdownContent";
import Dropdown from "../components/Dropdown";

const EntryListToolbar = ({
  currentViewLayout,
  showSpinner,
  isSubscriptionSelected,
  isCategorySelected,
  hasPreviousEntry,
  hasNextEntry,
  onMarkAsReadClick,
  onRefreshEntriesClick,
  onRemoveFeedOrCategoryClick,
  onViewLayoutChangeClick,
  onPreviousEntryClick,
  onNextEntryClick,
  onOpenExternalClick,
  onOpenEntryContentModalClick,
  onOpenEditFeedOrCategoryModalClick,
  onToggleSidebarClick
}) => {
  const spinnerCls = classNames({
    spinner: true,
    hide: !showSpinner
  });

  const editFeedOrCategoryCls = classNames("dropdown__list-item", {
    disabled: !isSubscriptionSelected && !isCategorySelected
  });

  return (
    <div className="toolbar">
      <Button
        type="header"
        onClick={onToggleSidebarClick}
        title="Mark all stories as read"
        className="hide-large-screen mr1">
        <MenuSVGIcon color="light-gray" size="small"/>
      </Button>
        <ButtonGroup className="btn-group-rounded">
        <Button
          type="header"
          onClick={onMarkAsReadClick}
          title="Mark all stories as read">
          <CheckmarkSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button
          type="header"
          onClick={onRefreshEntriesClick}
          title="Fetch new stories">
          <CycleSVGIcon color="light-gray" size="small"/>
        </Button>
      </ButtonGroup>
      <Dropdown className="ml1">
        <DropdownTrigger className="btn btn-header">
          <CogSVGIcon color="light-gray" size="small"/>
          <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down"/>
          <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up"/>
        </DropdownTrigger>
        <DropdownContent>
          <ul className="dropdown__list">
            <li
              className="dropdown__list-item"
              onClick={onViewLayoutChangeClick.bind(this, "list")}>
                <input
                  type="radio"
                  id="list"
                  name="currrent_view_layout"
                  checked={currentViewLayout === "list"}
                  readOnly={true}
                  className="dropdown-field media"/>
                <label
                  htmlFor="list"
                  className="dropdown-label content">List</label>
            </li>
            <li
              className="dropdown__list-item"
              onClick={onViewLayoutChangeClick.bind(this, "compact_list")}>
                <input
                  type="radio"
                  id="compact_list"
                  name="currrent_view_layout"
                  checked={currentViewLayout === "compact_list"}
                  readOnly={true}
                  className="dropdown-field media"/>
                <label
                  htmlFor="compact_list"
                  className="dropdown-label
                  content">Compact List</label>
            </li>
            <li
              className="dropdown__list-item"
              onClick={onViewLayoutChangeClick.bind(this, "grid")}>
                <input
                  type="radio"
                  id="grid"
                  name="currrent_view_layout"
                  checked={currentViewLayout === "grid"}
                  readOnly={true}
                  className="dropdown-field media"/>
                <label
                  htmlFor="grid"
                  className="dropdown-label content">Grid</label>
            </li>
            <li className="dropdown__list-separator"/>
            <li
              className={editFeedOrCategoryCls}
              onClick={onOpenEditFeedOrCategoryModalClick}>
              <div className="media">
                <CogSVGIcon color="light-gray" size="small"/>
              </div>
              <div className="content">Settings</div>
            </li>
            <li
              className={editFeedOrCategoryCls}
              onClick={onRemoveFeedOrCategoryClick}>
              <div className="media">
                <TrashSVGIcon color="light-gray" size="small"/>
              </div>
              <div className="content">Delete</div>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
      {currentViewLayout === "grid" &&
        <ButtonGroup className="btn-group-rounded ml2">
          <Button type="header" onClick={onPreviousEntryClick} disabled={!hasPreviousEntry}>
            <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
          </Button>
          <Button type="header" onClick={onNextEntryClick} disabled={!hasNextEntry}>
            <ArrowRightBoldSVGIcon color="light-gray" size="small"/>
          </Button>
        </ButtonGroup>
      }
      {currentViewLayout === "grid" &&
        <ButtonGroup className="btn-group-rounded ml2">
          <Button type="header" onClick={onOpenEntryContentModalClick}>
            <ResizeEnlargeSVGIcon color="light-gray" size="small"/>
          </Button>
          <Button type="header" onClick={onOpenExternalClick}>
            <EarthSVGIcon color="light-gray" size="small"/>
          </Button>
        </ButtonGroup>
      }
      <span className={spinnerCls}>
        <Icon name="spinner" size="small"/>
      </span>
    </div>
  );
};

EntryListToolbar.propTypes = {
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
  onOpenEntryContentModalClick: PropTypes.func.isRequired
};

export default EntryListToolbar;
