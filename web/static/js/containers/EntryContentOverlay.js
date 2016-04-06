import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import {
  ArrowLeftBoldSVGIcon,
  ArrowRightBoldSVGIcon,
  EarthSVGIcon,
  ResizeShrinkSVGIcon
} from "../components/SVGIcon";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import FeedEntryContent from "../components/FeedEntryContent";

class EntryContentOverlay extends Component {

  static propTypes = {
    currentEntry: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onPreviousClick: PropTypes.func.isRequired,
    onNextClick: PropTypes.func.isRequired,
    onOpenExternalClick: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };

    this.onClose = this.onClose.bind(this);
  }

  onClose(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    this.props.onClose();
  }

  render() {
    const { isOpen, currentEntry, onPreviousClick, onNextClick, onOpenExternalClick } = this.props;

    const customStyles = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        overflow: "hidden"
      },
      content: {
        top: "0",
        right: "0",
        left: "35%",
        bottom: "0",
        border: 0,
        borderRadius: 0,
        padding: 0
      }
    };

    return (
      <Modal
        isOpen={isOpen}
        style={customStyles}
        onRequestClose={this.onClose}
        className="entry-content-overlay">

        <div className="entry-content-overlay-header">
          <div className="actions">
            <ButtonGroup className="btn-group-rounded">
              <Button type="header" onClick={onPreviousClick}>
                <ArrowLeftBoldSVGIcon color="light-gray" size="small"/>
              </Button>
              <Button type="header" onClick={onNextClick}>
                <ArrowRightBoldSVGIcon color="light-gray" size="small"/>
              </Button>
            </ButtonGroup>
            <ButtonGroup className="btn-group-rounded ml2">
              <Button type="header" onClick={onOpenExternalClick}>
                <EarthSVGIcon color="light-gray" size="small"/>
              </Button>
            </ButtonGroup>
          </div>
          <a className="modal-close-link" onClick={this.onClose}>
            <ResizeShrinkSVGIcon color="gray" size="small"/>
          </a>
        </div>

        <div className="entry-content-overlay-content">
            <FeedEntryContent entry={currentEntry}/>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentEntry: state.currentEntry
  };
}

export default connect(mapStateToProps)(EntryContentOverlay);
