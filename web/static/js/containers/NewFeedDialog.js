import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";
import { push } from "react-router-redux";
import classNames from "classnames";

import { CrossSVGIcon } from "../components/SVGIcon";
import Icon from "../components/Icon";

import { feedFormUpdate, feedFormReset, requestCreateFeed } from "../redux/modules/feedForm";
import { addFeed } from "../redux/modules/feeds";

import { customModalStyles } from "../utils/ModalHelper";
import { renderErrorsFor } from "../utils";

class NewFeedDialog extends Component {

  static propTypes = {
    feedForm: PropTypes.object,
    categories: PropTypes.shape({
      items: PropTypes.array.isRequired
    }).isRequired,
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
      ReactDOM.findDOMNode(this.refs.feedUrl).focus();
    }, 0);
  }

  handleChange(event) {
    const { dispatch } = this.props;

    dispatch(feedFormUpdate({
      feedUrl: ReactDOM.findDOMNode(this.refs.feedUrl).value,
      categoryId: ReactDOM.findDOMNode(this.refs.categoryId).value
    }));
  }

  close(event) {
    const { dispatch } = this.props;

    if (event) event.preventDefault();
    dispatch(feedFormReset());
    this.props.onClose();
  }

  submitForm(event) {
    const { dispatch, feedForm } = this.props;
    event.preventDefault();

    dispatch(requestCreateFeed({
      feed_url: feedForm.feedUrl,
      category_id: feedForm.categoryId
    })).then((result) => {
      if (!result.errors) {
        this.props.onClose();
        // update sidebar feed list
        dispatch(addFeed({ item: result }));
        // navigate to new feed
        dispatch(push(`/feeds/${result.id}`));
      }
    });
  }

  render() {
    const { isOpen, feedForm, categories } = this.props;

    const feedUrlError = feedForm.errors && feedForm.errors.find(error => error.feed_url);
    const feedUrlCls = classNames({
      field: true,
      block: true,
      "col-12": true,
      "is-error": feedUrlError
    });

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
            <h1>Add new feed</h1>

            <div className="sm-col-12 mb2">
              {renderErrorsFor(feedForm.errors, "feed_url")}
            </div>

            <div className="sm-col-12 mb2">
              <label>Website address or feed title</label>
              <input
                className={feedUrlCls}
                type="text"
                placeholder="Enter website address or feed title here"
                ref="feedUrl"
                value={feedForm.feedUrl}
                onChange={(event) => this.handleChange(event)}
                autoFocus={true}/>

              <div className="hint">
                Website address must start with http://
              </div>
            </div>

            <div className="sm-col-12 mb3">
              <label>Select category</label>
              <select className="field block col-12"
                ref="categoryId"
                onChange={(event) => this.handleChange(event)}
                value={feedForm.category_id}>

                <option value="">Select ...</option>
                {categories.items.map((category) => {
                  return <option value={category.id} key={category.id}>{category.title}</option>;
                })}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary bg-blue white btn-large with-icon"
                disabled={!feedForm.feedUrl}
                onClick={this.submitForm}>
                  {feedForm.isLoading && <Icon name="spinner_white" size="small"/>}
                  Add Feed
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
    feedForm: state.feedForm,
    categories: state.categories
  };
}

export default connect(mapStateToProps)(NewFeedDialog);
