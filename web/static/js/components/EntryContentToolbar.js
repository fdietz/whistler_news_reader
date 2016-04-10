import React, { PropTypes } from "react";

import {
  ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon,
  EarthSVGIcon,
  ResizeEnlargeSVGIcon
} from "../components/SVGIcon";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";

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
          disabled={!currentEntry.hasPreviousEntry}>
          <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button
          type="header"
          onClick={onNextEntryClick}
          disabled={!currentEntry.hasNextEntry}>
          <ArrowRightBoldSVGIcon color="light-gray" size="small"/>
        </Button>
      </ButtonGroup>
      <ButtonGroup className="btn-group-rounded ml2">
        <Button
          type="header"
          onClick={onOpenEntryContentModalClick}
          disabled={!currentEntry.entry}>
          <ResizeEnlargeSVGIcon color="light-gray" size="small"/>
        </Button>
        <Button
          type="header"
          onClick={onOpenExternalClick}
          disabled={!currentEntry.entry}>
          <EarthSVGIcon color="light-gray" size="small"/>
        </Button>
      </ButtonGroup>
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
