import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";

import { CrossSVGIcon } from "../components/SVGIcon";
import Icon from "../components/Icon";

import { editFormUpdate, editFormReset } from "../redux/modules/editForm";
import { requestUpdateFeed } from "../redux/modules/feeds";
import { requestUpdateCategory } from "../redux/modules/categories";

import { reduceErrorsToString } from "../utils/ErrorHelper";
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

    const action = currentSidebarSelection.isFeed ? requestUpdateFeed : requestUpdateCategory;

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
    const errors = editForm.errors ? reduceErrorsToString(editForm.errors) : "";

    let labels;
    if (currentSidebarSelection.isFeed) {
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

            <div className="sm-col-12 mb2">
              <label>{labels.label}</label>
              <input className="field block col-12"
                type="text"
                placeholder="Enter title here"
                ref="title"
                value={editForm.title}
                onChange={(event) => this.handleChange(event)}
                autoFocus={true}/>

              <div className="hint">{labels.hint}</div>
            </div>

            {currentSidebarSelection.isFeed &&
              <div className="sm-col-12 mb2">
                <div className="hint">{currentSidebarSelection.selection.site_url}</div>
                <div className="hint">{currentSidebarSelection.selection.feed_url}</div>
              </div>
            }

            <div className="sm-col-12 mb3">
              {errors &&
                <p className="errors">{errors}</p>
              }
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary bg-blue white btn-large"
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
