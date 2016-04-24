import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";

import { CrossSVGIcon } from "../components/SVGIcon";
import Icon from "../components/Icon";

import { editFormUpdate, editFormReset } from "../redux/modules/editForm";
import { requestUpdateSubscription } from "../redux/modules/subscriptions";
import { requestUpdateCategory } from "../redux/modules/categories";

import { reduceErrorsToString } from "../utils/ErrorHelper";
import { renderErrorsFor } from "../utils";
import { customModalStyles } from "../utils/ModalHelper";

class EditDialog extends Component {

  static propTypes = {
    editForm: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    currentSidebarSelection: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    const { dispatch, currentSidebarSelection } = this.props;

    dispatch(editFormUpdate({ title: currentSidebarSelection.selection.title }));

    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.title).focus();
    }, 0);
  }

  handleChange(event) {
    const { dispatch } = this.props;
    dispatch(editFormUpdate({ title: ReactDOM.findDOMNode(this.refs.title).value }));
  }

  close(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    dispatch(editFormReset());
    this.props.onClose();
  }

  submitForm(event) {
    const { dispatch, editForm, onClose, currentSidebarSelection } = this.props;
    event.preventDefault();

    const action = currentSidebarSelection.isSubscription ? requestUpdateSubscription : requestUpdateCategory;

    dispatch(editFormUpdate());
    dispatch(action(currentSidebarSelection.selection.id, { title: editForm.title })).then((result) => {
      if (!result.errors) {
        dispatch(editFormReset());
        onClose();
      }
    });
  }

  render() {
    const { isOpen, editForm, currentSidebarSelection } = this.props;

    let labels;
    if (currentSidebarSelection.isSubscription) {
      labels = {
        heading: "Edit feed",
        label: "Feed title",
        hint: "Title must be 50 characters or less and cannot contain spaces or periods"
      };
    } else if (currentSidebarSelection.isCategory) {
      labels = {
        heading: "Edit category",
        label: "Category title",
        hint: "Title must be 50 characters or less and cannot contain spaces or periods"
      };
    } else {
      throw new Error("Unknown selection");
    }

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.close}
        style={customModalStyles}>

        <div className="modal-header">
          <div className="logo">whistle'r</div>
          <a className="modal-close-link" onClick={this.close}>
            <CrossSVGIcon color="white" size="medium"/>
          </a>
        </div>

        <div className="modal-content">
          <form onSubmit={this.submitForm} className="form-prominent sm-col-6">
            <h1>{labels.heading}</h1>

            {editForm.errors &&
              <div className="sm-col-12 mb2">
                <div className="errors">
                  {reduceErrorsToString(editForm.errors)}
                </div>
              </div>
            }
            <label className="field-label mb3">
              {labels.label}
              <input className="field block col-12"
                type="text"
                placeholder="Enter title here"
                ref="title"
                value={editForm.title}
                onChange={(event) => this.handleChange(event)}
                autoFocus={true}/>

              <div className="hint">{labels.hint}</div>
              {renderErrorsFor(editForm.errors, "title")}

              {currentSidebarSelection.isSubscription &&
                <div className="sm-col-12 mb2 mt2">
                  <div className="hint">{currentSidebarSelection.selection.site_url}</div>
                  <div className="hint">{currentSidebarSelection.selection.feed_url}</div>
                </div>
              }
            </label>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary bg-blue white btn-large with-icon"
                disabled={!editForm.title}
                onClick={this.submitForm}>
                  {editForm.isLoading && <Icon name="spinner_white" size="small"/>}
                  Save Changes
                </button>
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    editForm: state.editForm,
    currentSidebarSelection: state.currentSidebarSelection
  };
}

export default connect(mapStateToProps)(EditDialog);
