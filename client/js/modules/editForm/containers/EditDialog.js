import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Icon from '../../../components/Icon';

import * as FormActions from '../actions';
import * as SubscriptionsActions from '../../subscriptions/actions';
import * as CategoriesActions from '../../categories/actions';
import * as selectors from '../selectors';

import { reduceErrorsToString } from '../../../utils/ErrorHelper';
import { renderErrorsFor } from '../../../utils';

class EditDialog extends Component {

  static propTypes = {
    editForm: PropTypes.object.isRequired,
    selection: PropTypes.object.isRequired,
    isSubscriptionSelected: PropTypes.bool.isRequired,
    isCategorySelected: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    formActions: PropTypes.object.isRequired,
    subscriptionsActions: PropTypes.object.isRequired,
    categoriesActions: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    const { formActions, selection } = this.props;

    formActions.editFormUpdate({ title: selection.title });

    setTimeout(() => {
      this.titleRef.focus();
    }, 0);
  }

  handleChange() {
    const { formActions } = this.props;

    formActions.editFormUpdate({ title: this.titleRef.value });
  }

  close(event) {
    const { formActions, onClose } = this.props;

    if (event) event.preventDefault();
    formActions.editFormReset();
    onClose();
  }

  submitForm(event) {
    const {
      editForm,
      isSubscriptionSelected,
      selection,
      onClose,
      formActions,
      subscriptionsActions,
      categoriesActions
    } = this.props;
    event.preventDefault();

    const action = isSubscriptionSelected ?
      subscriptionsActions.requestUpdateSubscription
      :
      categoriesActions.requestUpdateCategory;

    formActions.editFormUpdate();
    action(selection.id, { title: editForm.title }).then((result) => {
      if (!result.errors) {
        formActions.editFormReset();
        onClose();
      }
    });
  }

  render() {
    const { editForm, selection, isSubscriptionSelected, isCategorySelected } = this.props;

    let labels;
    if (isSubscriptionSelected) {
      labels = {
        heading: 'Edit feed',
        label: 'Feed title',
        hint: 'Title must be 50 characters or less and cannot contain spaces or periods',
      };
    } else if (isCategorySelected) {
      labels = {
        heading: 'Edit category',
        label: 'Category title',
        hint: 'Title must be 50 characters or less and cannot contain spaces or periods',
      };
    } else {
      throw new Error('Unknown selection');
    }

    return (
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
          <label className="field-label mb3" htmlFor="title">
            {labels.label}
            <input
              className="field block col-12"
              id="title"
              type="text"
              placeholder="Enter title here"
              ref={(r) => { this.titleRef = r; }}
              value={editForm.title}
              onChange={(event) => this.handleChange(event)}
              autoFocus />

            <div className="hint">{labels.hint}</div>
            {renderErrorsFor(editForm.errors, 'title')}

            {isSubscriptionSelected &&
              <div className="sm-col-12 mb2 mt2">
                <div className="hint">{selection.site_url}</div>
                <div className="hint">{selection.feed_url}</div>
              </div>
            }
          </label>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary bg-blue white btn-large with-icon"
              disabled={!editForm.title || editForm.isLoading}
              onClick={this.submitForm} >
                {editForm.isLoading && <Icon name="spinner_white" size="small" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    editForm: state.editForm,
    category: state.categories.byId[ownProps.params.category_id],
    subscription: state.subscriptions.byId[ownProps.params.subscription_id],
    selection: selectors.selection(state, ownProps),
    isSubscriptionSelected: selectors.isSubscriptionSelected(ownProps),
    isCategorySelected: selectors.isCategorySelected(ownProps),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formActions: bindActionCreators(FormActions, dispatch),
    subscriptionsActions: bindActionCreators(SubscriptionsActions, dispatch),
    categoriesActions: bindActionCreators(CategoriesActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditDialog);
