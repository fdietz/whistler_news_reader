import React, { PropTypes } from "react";

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

import * as ShareHelper from "../utils/ShareHelper";

const EntryContentToolbar = ({
  currentEntry,
  onPreviousEntryClick,
  onNextEntryClick,
  onOpenExternalClick,
  onOpenEntryContentModalClick
}) => {

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
      <ButtonGroup className="btn-group-rounded ml2">
        <Button
          type="header"
          onClick={onOpenEntryContentModalClick}
          disabled={!currentEntry.entry}
          title="Open story in large preview">
          <ResizeEnlargeSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button
          type="header"
          onClick={onOpenExternalClick}
          disabled={!currentEntry.entry}
          title="Open story in new browser tab or window">
          <EarthSVGIcon color="light-gray" size="small"/>
        </Button>
      </ButtonGroup>
        <Dropdown className="ml1">
          <DropdownTrigger className="btn btn-header" disabled={!currentEntry.entry}>
            <ShareSVGIcon color="light-gray" size="small"/>
            <ArrowDownSVGIcon color="light-gray" size="small" className="arrow-down"/>
            <ArrowUpSVGIcon color="light-gray" size="small" className="arrow-up"/>
          </DropdownTrigger>
          <DropdownContent>
          {currentEntry.entry &&
            <ul className="dropdown__list">
              <li className="dropdown__list-item">
                <a
                  href={ShareHelper.twitterUrl(currentEntry.entry.url)}
                  target="_blank">Twitter</a>
              </li>
              <li className="dropdown__list-item">
                <a
                  href={ShareHelper.facebookUrl(currentEntry.entry.url)}
                  target="_blank">Facebook</a>
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
  onOpenEntryContentModalClick: PropTypes.func.isRequired
};

export default EntryContentToolbar;
