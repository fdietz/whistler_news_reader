import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import Modal from "react-modal";
import ReactDOM from 'react-dom';

// import { CrossSVGIcon } from "components/SVGIcon";
import Icon from 'components/Icon';

import { editFormUpdate, editFormReset } from 'redux/modules/editForm';
import { requestUpdateSubscription } from 'redux/modules/subscriptions';
import { requestUpdateCategory } from 'redux/modules/categories';

import { reduceErrorsToString } from 'utils/ErrorHelper';
import { renderErrorsFor } from 'utils';

class EditDialog extends Component {

  static propTypes = {
    editForm: PropTypes.object.isRequired,
    selection: PropTypes.object.isRequired,
    isSubscriptionSelected: PropTypes.bool.isRequired,
    isCategorySelected: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    const { dispatch, selection } = this.props;

    dispatch(editFormUpdate({ title: selection.title }));

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
    const { dispatch, editForm, isSubscriptionSelected, selection, onClose } = this.props;
    event.preventDefault();

    const action = isSubscriptionSelected ? requestUpdateSubscription : requestUpdateCategory;

    dispatch(editFormUpdate());
    dispatch(action(selection.id, { title: editForm.title })).then((result) => {
      if (!result.errors) {
        dispatch(editFormReset());
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
          <label className="field-label mb3">
            {labels.label}
            <input
              className="field block col-12"
              type="text"
              placeholder="Enter title here"
              ref="title"
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

function isSubscriptionSelected(ownProps) {
  return ownProps.location.pathname.startsWith('/subscriptions');
}

function isCategorySelected(ownProps) {
  return ownProps.location.pathname.startsWith('/categories');
}

function selection(state, ownProps) {
  return isSubscriptionSelected(ownProps)
    ? state.subscriptions.byId[ownProps.params.subscription_id]
    : state.categories.byId[ownProps.params.category_id];
}

function mapStateToProps(state, ownProps) {
  return {
    editForm: state.editForm,
    category: state.categories.byId[ownProps.params.category_id],
    subscription: state.subscriptions.byId[ownProps.params.subscription_id],
    selection: selection(state, ownProps),
    isSubscriptionSelected: isSubscriptionSelected(ownProps),
    isCategorySelected: isCategorySelected(ownProps),
  };
}

export default connect(mapStateToProps)(EditDialog);
