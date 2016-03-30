import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";

import Icon from "../components/Icon";

import { categoryFormUpdate, categoryFormReset } from "../redux/modules/categoryForm";
import createCategoryAction from "../redux/actions/createCategoryAction";

import { reduceErrorsToString } from "../utils/ErrorHelper";
import { customModalStyles } from "../utils/ModalHelper";

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
    const errors = categoryForm.errors ? reduceErrorsToString(categoryForm.errors) : "";

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={this.close}
        style={customModalStyles}>

        <div className="modal-header">
          <a className="modal-close-link" onClick={this.close}>
            <Icon name="cross" size="prominent"/>
          </a>
        </div>

        <div className="modal-content">
          <form onSubmit={this.submitForm} className="form-prominent sm-col-6">
            <h1>Create a new category</h1>
            <label>Category title</label>
            <input className="field block col-12"
              type="text"
              placeholder="Enter title here"
              ref="input"
              value={categoryForm.title}
              onChange={(event) => this.handleChange(event)}
              autoFocus={true}/>

            <div className="hint">
              Title must be 50 characters or less and cannot contain spaces or periods
            </div>

            {errors &&
              <p className="errors">{errors}</p>
            }

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary bg-blue white btn-large"
                disabled={!categoryForm.title}
                onClick={this.submitForm}>Add Category</button>
              <button
                onClick={this.close}
                className="btn">Close</button>
            </div>
          </form>
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
