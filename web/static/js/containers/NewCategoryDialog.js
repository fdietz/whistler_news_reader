import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";

import { CrossSVGIcon } from "../components/SVGIcon";
import Icon from "../components/Icon";

import { categoryFormUpdate, categoryFormReset } from "../redux/modules/categoryForm";
import createCategoryAction from "../redux/actions/createCategoryAction";

import { reduceErrorsToString } from "../utils/ErrorHelper";
import { customModalStyles } from "../utils/ModalHelper";

class NewCategoryDialog extends Component {

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
          <div className="logo">whistle'r</div>
          <a className="modal-close-link" onClick={this.close}>
            <CrossSVGIcon color="white" size="medium"/>
          </a>
        </div>

        <div className="modal-content">
          <form onSubmit={this.submitForm} className="form-prominent sm-col-6">
            <h1>Add new category</h1>

            <div className="sm-col-12 mb2">
              <label>Category title</label>
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
            </div>

            <div className="sm-col-12 mb3">
              {errors &&
                <p className="errors">{errors}</p>
              }
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary bg-blue white btn-large"
                disabled={!categoryForm.title}
                onClick={this.submitForm}>
                  {categoryForm.isLoading && <Icon name="spinner_white" size="small"/>}
                  Add Category
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
    categoryForm: state.categoryForm
  };
}

export default connect(mapStateToProps)(NewCategoryDialog);
