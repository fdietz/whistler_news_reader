import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import Icon from "../components/Icon";

import { createFeedResetForm } from "../redux/modules/createFeed";
import createFeedAction from "../redux/actions/createFeedAction";

class NewFeedForm extends Component {

  static propTypes = {
    createFeed: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    closeNewFeedModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      feedUrl: ""
    };

    this.closeNewFeedModal = this.closeNewFeedModal.bind(this);
    this.handleNewFeedChange = this.handleNewFeedChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleNewFeedChange(event) {
    this.setState({ feedUrl: event.target.value });
  }

  closeNewFeedModal(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    this.setState({ feedUrl: "" });
    dispatch(createFeedResetForm());
    this.props.closeNewFeedModal();
  }

  submitForm(event) {
    const { dispatch} = this.props;
    event.preventDefault();

    dispatch(createFeedAction(this.state.feedUrl)).then((result) => {
      if (!result.errors) {
        this.setState({ feedUrl: "" });
        this.props.closeNewFeedModal();
      }
    });
  }

  render() {
    const { isOpen } = this.props;

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
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        border: "2",
        borderRadius: "2px",
        padding: 0
      }
    };

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.closeNewFeedModal}
        style={customStyles}>

        <div className="modal-header">
          <h2>Add new feed</h2>
          <a className="modal-close-link" onClick={this.closeNewFeedModal}>
            <Icon name="cross"/>
          </a>
        </div>

        <div className="modal-content">
          <form onSubmit={this.submitForm} className="form-prominent2">
            <input className="field"
              type="text"
              placeholder="Website or feed"
              value={this.state.feedUrl}
              onChange={(event) => this.handleNewFeedChange(event)}
              autoFocus={true}/>
            {this.props.createFeed &&
              this.props.createFeed.errors &&
              this.props.createFeed.errors[0]["feed_url"] &&
              <p>
                Error creating feed:
                {this.props.createFeed.errors[0]["feed_url"]}
              </p>
            }
          </form>
        </div>

        <div className="modal-footer">
          <button
            onClick={this.closeNewFeedModal}
            className="btn">Close</button>
          <button
            type="submit"
            className="btn btn-primary bg-blue white"
            disabled={!this.state.feedUrl}
            onClick={this.submitForm}>Add Feed</button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    createFeed: state.createFeed
  };
}

export default connect(mapStateToProps)(NewFeedForm);
