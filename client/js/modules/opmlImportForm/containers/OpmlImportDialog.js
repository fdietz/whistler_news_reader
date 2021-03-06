import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Icon from '../../../components/Icon';

import * as OpmlImportFormActions from '../actions';
import * as FeedActions from '../../feeds/actions';

class OpmlImportDialog extends Component {

  static propTypes = {
    opmlImportForm: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    feedsActions: PropTypes.object.isRequired,
    opmlImportFormActions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.close = this.close.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleChange() {
    const { opmlImportFormActions } = this.props;
    opmlImportFormActions.opmlImportFormUpdate({
      file: this.fileRef.value,
    });
  }

  close(event) {
    const { opmlImportFormActions } = this.props;

    if (event) event.preventDefault();
    opmlImportFormActions.opmlImportFormReset();
    this.props.onClose();
  }

  submitForm(event) {
    const { opmlImportFormActions, onClose, feedsActions } = this.props;
    event.preventDefault();

    opmlImportFormActions.opmlImportFormUpdate();

    const file = this.fileRef;
    const data = new FormData();
    data.append('file', file.files[0]);

    opmlImportFormActions.requestOpmlImport(data).then((result) => {
      if (!result.error) {
        opmlImportFormActions.opmlImportFormReset();
        onClose();
        // feedsActions.requestFetchFeeds();
      }
    });
  }

  render() {
    const { opmlImportForm } = this.props;

    return (
      <div className="modal-content">
        <form onSubmit={this.submitForm} className="form-prominent sm-col-6">
          <h1>Import Your Subscriptions</h1>

          <div className="sm-col-12 mb2">
            <label htmlFor="file">
              Select file to upload...
            </label>
            <input
              className="field block col-12"
              type="file"
              id="file"
              placeholder="Enter title here"
              ref={(r) => { this.fileRef = r; }}
              onChange={(event) => this.handleChange(event)}
              autoFocus />

            <div className="hint">
              Moving from another RSS Reader. You can upload your
              subscriptions in standard OPML format.
            </div>
          </div>

          <div className="sm-col-12 mb3">
            {opmlImportForm.error &&
              <p className="errors">{opmlImportForm.error}</p>
            }
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary bg-blue white btn-large with-icon"
              disabled={!opmlImportForm.file || opmlImportForm.isLoading}
              onClick={this.submitForm}>
                {opmlImportForm.isLoading && <Icon name="spinner_white" size="small" />}
                Import
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    opmlImportForm: state.opmlImportForm,
    feedsActions: state.feedsActions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    feedsActions: bindActionCreators(FeedActions, dispatch),
    opmlImportFormActions: bindActionCreators(OpmlImportFormActions, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(OpmlImportDialog);
