import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom";

import Icon from "../components/Icon";

import { feedFormUpdate, feedFormReset } from "../redux/modules/feedForm";
import createFeedAction from "../redux/actions/createFeedAction";

import { reduceErrorsToString } from "../utils/ErrorHelper";
import { customModalStyles } from "../utils/ModalHelper";

class NewFeedForm extends Component {

  static propTypes = {
    feedForm: PropTypes.object,
    categories: PropTypes.shape({
      items: PropTypes.array.isRequired
    }),
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

    dispatch(createFeedAction({
      feed_url: feedForm.feedUrl,
      category_id: feedForm.categoryId
    })).then((result) => {
      if (!result.errors) {
        dispatch(feedFormReset());
        this.props.onClose();
      }
    });
  }

  render() {
    const { isOpen, feedForm, categories } = this.props;
    const errors = feedForm.errors ? reduceErrorsToString(feedForm.errors) : "";

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
            <h1>Add a new feed</h1>
            <label>Website url or feed title</label>
            <input className="field block col-12"
              type="text"
              placeholder="Enter website url or feed title here"
              ref="feedUrl"
              value={feedForm.feedUrl}
              onChange={(event) => this.handleChange(event)}
              autoFocus={true}/>

            <div className="hint mb2">
              Website url must start with http://
            </div>

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

            {errors &&
              <p className="errors">{errors}</p>
            }

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary bg-blue white btn-large"
                disabled={!feedForm.feedUrl}
                onClick={this.submitForm}>Add Feed</button>
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
    feedForm: state.feedForm,
    categories: state.categories
  };
}

export default connect(mapStateToProps)(NewFeedForm);
