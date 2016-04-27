import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import ReactDOM from "react-dom";
import { push } from "react-router-redux";

import Icon from "../components/Icon";

import {
  categoryFormUpdate,
  categoryFormReset,
  requestCreateCategory
} from "../redux/modules/categoryForm";

import { addCategory } from "../redux/modules/categories";

import { reduceErrorsToString } from "../utils/ErrorHelper";
import { renderErrorsFor } from "../utils";

class NewCategoryDialog extends Component {

  static propTypes = {
    categoryForm: PropTypes.object,
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
      ReactDOM.findDOMNode(this.refs.title).focus();
    }, 0);
  }

  handleChange(event) {
    const { dispatch } = this.props;
    dispatch(categoryFormUpdate({ title: ReactDOM.findDOMNode(this.refs.title).value }));
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

    dispatch(requestCreateCategory({ title: categoryForm.title})).then((result) => {
      if (!result.error) {
        onClose();
        dispatch(push(`/categories/${result.id}`));
        dispatch(addCategory(result));
      }
    });
  }

  render() {
    const { isOpen, categoryForm } = this.props;

    return (
      <div className="modal-content">
        <form onSubmit={this.submitForm} className="form-prominent sm-col-6">
          <h1>Add new category</h1>

          {categoryForm.errors &&
            <div className="sm-col-12 mb2">
              {renderErrorsFor(categoryForm.errors, "base")}
            </div>
          }

          <label className="field-label mb3">
            Category title
            <input className="field block col-12"
              type="text"
              placeholder="Enter title here"
              ref="title"
              value={categoryForm.title}
              onChange={(event) => this.handleChange(event)}
              autoFocus={true}/>

            <div className="hint">
              Title must be 50 characters or less and cannot contain spaces or periods
            </div>

            {renderErrorsFor(categoryForm.errors, "title")}
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary bg-blue white btn-large with-icon"
              disabled={!categoryForm.title}
              onClick={this.submitForm}>
                {categoryForm.isLoading && <Icon name="spinner_white" size="small"/>}
                Add Category
              </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    categoryForm: state.categoryForm
  };
}

export default connect(mapStateToProps)(NewCategoryDialog);
