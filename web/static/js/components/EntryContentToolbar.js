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
