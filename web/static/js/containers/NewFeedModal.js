import React, {Component, PropTypes} from "react";
import { pushState } from "redux-router";
import { connect } from "react-redux";

import { requestCreateFeed } from "../actions";

class NewFeedModal extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    returnTo: PropTypes.string.isRequired,
    createFeed: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      feedUrl: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, returnTo } = this.props;

    console.log("componentWillReceiveProps", nextProps)
    if (nextProps && nextProps.createFeed && nextProps.createFeed.feed) {
      // navigate to new feed url
      dispatch(pushState(null, returnTo));
    }
  }

  handleChange(event) {
    console.log("handleChange")
    this.setState({ feedUrl: event.target.value });
  }

  submitForm(event) {
    console.log("submit")
    const { dispatch} = this.props;
    dispatch(requestCreateFeed(this.state.feedUrl));
    event.preventDefault();
  }

  cancel() {
    console.log("cancel")
    const { dispatch, returnTo } = this.props;
    dispatch(pushState(null, returnTo));
  }

  render() {
    const { createFeed } = this.props;
    let error;
    if (createFeed.error) {
      error = (
        <div className="form-message">Error adding feed: {createFeed.error}</div>
      );
    }

    return (
      <div className="modal-body">
        <div className="modal-header">
          <h2>Add Feed</h2>
        </div>
        <div className="modal-content">
          <form className="form form-stacked form-prominent">
              <input className="pure-input-1"
                  type="text"
                  placeholder="Enter feed url"
                  value={this.state.feedUrl}
                  onChange={(event) => this.handleChange(event)}
                  autoFocus/>
                {error}
          </form>
        </div>
        <div className="modal-footer">
          <button type="submit" className="btn btn--blue" onClick={(event) => this.submitForm(event)}>Add Feed</button>
          <button onClick={() => this.cancel()}
            className="btn">close</button>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    createFeed: state.createFeed
  };
}

export default connect(mapStateToProps)(NewFeedModal);
