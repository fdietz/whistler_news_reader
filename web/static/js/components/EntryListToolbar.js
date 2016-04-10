import React, { PropTypes } from "react";
import classNames from "classnames";

import Icon from "../components/Icon";
import { CheckmarkSVGIcon, TrashSVGIcon, CycleSVGIcon, ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon, EarthSVGIcon, ResizeEnlargeSVGIcon, CogSVGIcon,
  ArrowDownSVGIcon, ArrowUpSVGIcon } from "../components/SVGIcon";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import DropdownTrigger from "../components/DropdownTrigger";
import DropdownContent from "../components/DropdownContent";
import Dropdown from "../components/Dropdown";

const EntryListToolbar = ({
  currentViewLayout,
  entries,
  onMarkAsReadClick,
  onRefreshEntriesClick,
  onRemoveFeedOrCategoryClick,
  onViewLayoutChangeClick,
  onPreviousEntryClick,
  onNextEntryClick,
  onOpenExternalClick,
  onOpenEntryContentModalClick,
  onOpenEditFeedOrCategoryModalClick
}) => {
  const spinnerCls = classNames({
    spinner: true,
    hide: !entries.isLoading
  });

  return (
  <div className="toolbar">
    <ButtonGroup className="btn-group-rounded">
        <Button type="header" onClick={onMarkAsReadClick}>
          <CheckmarkSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button type="header" onClick={onRefreshEntriesClick}>
          <CycleSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button type="header" onClick={onRemoveFeedOrCategoryClick}>
          <TrashSVGIcon color="light-gray" size="small"/>
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
                  className="dropdown-field media"/>
                <label
                  htmlFor="grid"
                  className="dropdown-label content">Grid</label>
            </li>
            <li className="dropdown__list-separator"/>
            <li
              className="dropdown__list-item"
              onClick={onOpenEditFeedOrCategoryModalClick}>
              <div className="media"/>
              <div className="content">Settings</div>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
      {currentViewLayout === "grid" &&
        <ButtonGroup className="btn-group-rounded ml2">
          <Button type="header" onClick={onPreviousEntryClick}>
            <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
          </Button>
          <Button type="header" onClick={onNextEntryClick}>
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
  entries: PropTypes.object.isRequired,
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
