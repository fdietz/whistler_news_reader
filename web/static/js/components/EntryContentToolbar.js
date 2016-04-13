import React, { PropTypes } from "react";
import classNames from "classnames";

import {
  ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon,
  ArrowDownSVGIcon,
  ArrowUpSVGIcon,
  EarthSVGIcon,
  ResizeEnlargeSVGIcon,
  ShareSVGIcon
} from "../components/SVGIcon";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import DropdownTrigger from "../components/DropdownTrigger";
import DropdownContent from "../components/DropdownContent";
import Dropdown from "../components/Dropdown";

import {
  MailLink,
  TwitterLink,
  FacebookLink,
  GooglePlusLink,
  PinterestLink
} from "../components/ShareButton";

const EntryContentToolbar = ({
  currentEntry,
  onPreviousEntryClick,
  onNextEntryClick,
  onOpenExternalClick,
  onOpenEntryContentModalClick,
  showEntryContentModalButton = false
}) => {
  const shareDropdownCls = classNames("btn btn-header", {
    disabled: !currentEntry.entry
  });

  return (
    <div className="toolbar">
      <ButtonGroup className="btn-group-rounded">
        <Button
          type="header"
          onClick={onPreviousEntryClick}
          disabled={!currentEntry.hasPreviousEntry}
          title="Select previous story">
          <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button
          type="header"
          onClick={onNextEntryClick}
          disabled={!currentEntry.hasNextEntry}
          title="Select next story">
          <ArrowRightBoldSVGIcon color="light-gray" size="small"/>
        </Button>
      </ButtonGroup>
      <ButtonGroup className="btn-group-rounded ml1">
        {showEntryContentModalButton &&
          <Button
            type="header"
            onClick={onOpenEntryContentModalClick}
            disabled={!currentEntry.entry}
            title="Open story in large preview">
            <ResizeEnlargeSVGIcon color="light-gray" size="small"/>
          </Button>
        }
        <Button
          type="header"
          onClick={onOpenExternalClick}
          disabled={!currentEntry.entry}
          title="Open story in new browser tab or window">
          <EarthSVGIcon color="light-gray" size="small"/>
        </Button>
      </ButtonGroup>
        <Dropdown className="ml1">
          <DropdownTrigger className={shareDropdownCls}>
            <ShareSVGIcon color="light-gray" size="small"/>
            <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down"/>
            <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up"/>
          </DropdownTrigger>
          <DropdownContent>
          {currentEntry.entry &&
            <ul className="dropdown__list">
              <li className="dropdown__list-item">
                <MailLink {...currentEntry.entry}/>
              </li>
              <li className="dropdown__list-item">
                <TwitterLink {...currentEntry.entry}/>
              </li>
              <li className="dropdown__list-item">
                <FacebookLink {...currentEntry.entry}/>
              </li>
              <li className="dropdown__list-item">
                <GooglePlusLink {...currentEntry.entry}/>
              </li>
              <li className="dropdown__list-item">
                <PinterestLink {...currentEntry.entry}/>
              </li>
            </ul>
          }
          </DropdownContent>
        </Dropdown>
    </div>
  );
};

EntryContentToolbar.propTypes = {
  currentEntry: PropTypes.object.isRequired,
  onPreviousEntryClick: PropTypes.func.isRequired,
  onNextEntryClick: PropTypes.func.isRequired,
  onOpenExternalClick: PropTypes.func.isRequired,
  showEntryContentModalButton: PropTypes.bool.isRequired,
  onOpenEntryContentModalClick: PropTypes.func
};

export default EntryContentToolbar;
