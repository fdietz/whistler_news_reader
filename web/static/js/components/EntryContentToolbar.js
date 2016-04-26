import React, { PropTypes } from "react";
import classNames from "classnames";

import {
  ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon,
  ArrowDownSVGIcon,
  ArrowUpSVGIcon,
  EarthSVGIcon,
  GoBackSVGIcon,
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
  entry,
  hasPreviousEntry,
  hasNextEntry,
  onPreviousEntryClick,
  onNextEntryClick,
  onOpenExternalClick,
  onGoBackClick
}) => {
  const shareDropdownCls = classNames("btn btn-header", {
    disabled: !entry
  });

  return (
    <div className="toolbar">
      <Button
        type="header"
        onClick={onGoBackClick}
        title="Go back"
        className="hide-medium-screen mr1">
        <GoBackSVGIcon color="light-gray" size="small"/>
      </Button>
      <ButtonGroup className="btn-group-rounded">
        <Button
          type="header"
          onClick={onPreviousEntryClick}
          disabled={!hasPreviousEntry}
          title="Select previous story">
          <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button
          type="header"
          onClick={onNextEntryClick}
          disabled={!hasNextEntry}
          title="Select next story">
          <ArrowRightBoldSVGIcon color="light-gray" size="small"/>
        </Button>
      </ButtonGroup>
      <ButtonGroup className="btn-group-rounded ml1">
        <Button
          type="header"
          onClick={onOpenExternalClick}
          disabled={!entry}
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
          {entry &&
            <ul className="dropdown__list">
              <li className="dropdown__list-item">
                <MailLink {...entry}/>
              </li>
              <li className="dropdown__list-item">
                <TwitterLink {...entry}/>
              </li>
              <li className="dropdown__list-item">
                <FacebookLink {...entry}/>
              </li>
              <li className="dropdown__list-item">
                <GooglePlusLink {...entry}/>
              </li>
              <li className="dropdown__list-item">
                <PinterestLink {...entry}/>
              </li>
            </ul>
          }
          </DropdownContent>
        </Dropdown>
    </div>
  );
};

EntryContentToolbar.propTypes = {
  entry: PropTypes.object,
  hasPreviousEntry: PropTypes.bool.isRequired,
  hasNextEntry: PropTypes.bool.isRequired,
  onPreviousEntryClick: PropTypes.func.isRequired,
  onNextEntryClick: PropTypes.func.isRequired,
  onOpenExternalClick: PropTypes.func.isRequired,
  onGoBackClick: PropTypes.func.isRequired
};

export default EntryContentToolbar;
