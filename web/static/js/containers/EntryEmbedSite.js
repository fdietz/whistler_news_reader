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

    this.state = {
      isLoading: true
    };

    this.onClose = this.onClose.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onClose(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    this.props.onClose();
  }

  onLoad() {
    this.setState({ isLoading: false });
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
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      },
      content: {
        top: "0",
        left: "0",
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
        onRequestClose={this.onClose}
        className="entry-embed-site-modal">

        <div className="entry-embed-site-modal-header">
          <a className="modal-close-link" onClick={this.onClose}>
            <Icon name="resize-shrink" size="small"/>
          </a>
          <div className="centered">
            <h2>{currentEntry.title}</h2>
            <a href={currentEntry.url}><h6>{currentEntry.url}</h6></a>
          </div>
          <span className="loading-indicator">
            {this.state.isLoading && <Icon name="spinner"/>}
          </span>
        </div>

        <div className="entry-embed-site-modal-content">
          <iframe
            src={currentEntry.url}
            onLoad={this.onLoad}
            className="entry-embed-site"/>
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
