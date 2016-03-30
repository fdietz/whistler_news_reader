import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";

import Icon from "../components/Icon";

import { categoryFormUpdate, categoryFormReset } from "../redux/modules/categoryForm";
import createCategoryAction from "../redux/actions/createCategoryAction";

import { reduceErrorsToString } from "../utils/ErrorHelper";

class AddCategoryDialog extends Component {

  static propTypes = {
    categoryForm: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      ReactDOM.findDOMNode(this.refs.input).focus();
    }, 0);
  }

  handleChange(event) {
    const { dispatch } = this.props;
    dispatch(categoryFormUpdate({ title: event.target.value }));
  }

  close(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    dispatch(categoryFormReset());
    this.props.onClose();
  }

  submitForm(event) {
    const { dispatch, categoryForm, onClose } = this.props;
    event.preventDefault();

    dispatch(createCategoryAction({ title: categoryForm.title })).then((result) => {
      if (!result.errors) {
        dispatch(categoryFormReset());
        onClose();
      }
    });
  }

  render() {
    const { isOpen, categoryForm } = this.props;

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

    const errors = categoryForm.errors ? reduceErrorsToString(categoryForm.errors) : "";

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.close}
        style={customStyles}>

        <div className="modal-header">
          <h2>Create New Category</h2>
          <a className="modal-close-link" onClick={this.close}>
            <Icon name="cross"/>
          </a>
        </div>

        <div className="modal-content">
          <form onSubmit={this.submitForm} className="form-prominent2">
            <input className="field"
              type="text"
              placeholder="Category title"
              ref="input"
              value={categoryForm.title}
              onChange={(event) => this.handleChange(event)}
              autoFocus={true}/>
            {errors &&
              <p className="errors">{errors}</p>
            }
          </form>
        </div>

        <div className="modal-footer">
          <button
            onClick={this.close}
            className="btn">Close</button>
          <button
            type="submit"
            className="btn btn-primary bg-blue white"
            disabled={!categoryForm.title}
            onClick={this.submitForm}>Add Category</button>
        </div>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    categoryForm: state.categoryForm
  };
}

export default connect(mapStateToProps)(AddCategoryDialog);
