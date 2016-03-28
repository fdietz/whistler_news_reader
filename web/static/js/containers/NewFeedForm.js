import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";

import Icon from "../components/Icon";

import { feedFormUpdate, feedFormReset } from "../redux/modules/feedForm";
import createFeedAction from "../redux/actions/createFeedAction";

import { reduceErrorsToString } from "../utils/ErrorHelper";

class NewFeedForm extends Component {

  static propTypes = {
    feedForm: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    closeNewFeedModal: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.closeNewFeedModal = this.closeNewFeedModal.bind(this);
    this.handleNewFeedChange = this.handleNewFeedChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.input).focus();
      console.log("focus")
    }, 0);
  }

  handleNewFeedChange(event) {
    const { dispatch } = this.props;
    dispatch(feedFormUpdate({ feedUrl: event.target.value }));
  }

  closeNewFeedModal(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    dispatch(feedFormReset());
    this.props.closeNewFeedModal();
  }

  submitForm(event) {
    const { dispatch, feedForm } = this.props;
    event.preventDefault();

    dispatch(createFeedAction(feedForm.feedUrl)).then((result) => {
      if (!result.errors) {
        dispatch(feedFormReset());
        this.props.closeNewFeedModal();
      }
    });
  }

  render() {
    const { isOpen, feedForm } = this.props;

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

    const errors = feedForm.errors ? reduceErrorsToString(feedForm.errors) : "";

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
              ref="input"
              value={feedForm.feedUrl}
              onChange={(event) => this.handleNewFeedChange(event)}
              autoFocus={true}/>
            {errors &&
              <p className="errors">{errors}</p>
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
            disabled={!feedForm.feedUrl}
            onClick={this.submitForm}>Add Feed</button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    feedForm: state.feedForm
  };
}

export default connect(mapStateToProps)(NewFeedForm);
