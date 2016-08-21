import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { routerActions as RouterActions } from 'react-router-redux';

import Icon from '../../../components/Icon';

import * as FormActions from '../actions';
import * as CategoriesActions from '../../categories/actions';

import { renderErrorsFor } from '../../../utils';

class NewCategoryDialog extends Component {

  static propTypes = {
    categoryForm: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    formActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired,
    routerActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.titleRef.focus();
    }, 0);
  }

  handleChange() {
    const { formActions } = this.props;
    formActions.categoryFormUpdate({ title: this.titleRef.value });
  }

  close(event) {
    const { formActions, onClose } = this.props;

    if (event) event.preventDefault();
    formActions.categoryFormReset();
    onClose();
  }

  submitForm(event) {
    const { routerActions, formActions, categoriesActions, categoryForm, onClose } = this.props;
    event.preventDefault();

    formActions.requestCreateCategory({ title: categoryForm.title }).then((result) => {
      if (!result.error) {
        onClose();
        routerActions.push(`/categories/${result.id}`);
        categoriesActions.addCategory(result);
      }
    });
  }

  render() {
    const { categoryForm } = this.props;

    return (
      <div className="modal-content">
        <form onSubmit={this.submitForm} className="form-prominent sm-col-6">
          <h1>Add new category</h1>

          {categoryForm.errors &&
            <div className="sm-col-12 mb2">
              {renderErrorsFor(categoryForm.errors, 'base')}
            </div>
          }

          <label className="field-label mb3" htmlFor="title">
            Category title
            <input
              className="field block col-12"
              type="text"
              id="title"
              placeholder="Enter title here"
              ref={(r) => { this.titleRef = r; }}
              value={categoryForm.title}
              onChange={(event) => this.handleChange(event)}
              autoFocus />

            <div className="hint">
              Title must be 50 characters or less and cannot contain spaces or periods
            </div>

            {renderErrorsFor(categoryForm.errors, 'title')}
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary bg-blue white btn-large with-icon"
              disabled={!categoryForm.title || categoryForm.isLoading}
              onClick={this.submitForm} >
                {categoryForm.isLoading && <Icon name="spinner_white" size="small" />}
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
    categoryForm: state.categoryForm,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formActions: bindActionCreators(FormActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
    routerActions: bindActionCreators(RouterActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCategoryDialog);
