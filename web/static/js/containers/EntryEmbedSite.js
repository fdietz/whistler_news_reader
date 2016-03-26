import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import Icon from "../components/Icon";

class EntryEmbedSite extends Component {

  static propTypes = {
    currentEntry: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
  }

  onClose(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    this.props.onClose();
  }

  render() {
    const { isOpen, currentEntry } = this.props;

    const customStyles = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)"
      },
      content: {
        top: "0",
        left: "25%",
        right: "0",
        bottom: "0",
        border: "2",
        borderRadius: "2px",
        padding: 0
      }
    };

    return (
      <Modal
        isOpen={isOpen}
        style={customStyles}
        className="entry-embed-site-modal">

        <div className="modal-header">
          <h2>{currentEntry.title}</h2>
          <a className="modal-close-link" onClick={this.onClose}>
            <Icon name="resize-shrink" size="small"/>
          </a>
        </div>

        <div className="modal-content">
          <iframe src={currentEntry.url} className="entry-embed-site"/>
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

export default connect(mapStateToProps)(EntryEmbedSite);
