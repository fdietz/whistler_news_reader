import React, {Component, PropTypes} from "react";
import { pushState } from "redux-router";

import { createFeed } from "../actions";
export default class NewFeedModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalValue: ""
    }
  }

  handleModalChange(event) {
    this.setState({ modalValue: event.target.value });
  }

  submitAndCloseModal() {
    const { dispatch, returnTo } = this.props;
    dispatch(createFeed(this.state.modalValue));
    dispatch(pushState(null, returnTo));
  }

  closeModal() {
    const { dispatch, returnTo } = this.props;
    dispatch(pushState(null, returnTo));
  }

  render() {
    return (
      <div>
        <h2>Enter feed adress</h2>
        <form>
          <input type="text"
            value={this.state.modalValue}
            onChange={(event) => this.handleModalChange(event)}
            autoFocus/>
        </form>
        <button onClick={() => this.submitAndCloseModal()}
          className="btn btn--blue">Add Feed</button>
        <button onClick={() => this.closeModal()}
          className="btn">close</button>
      </div>
    );
  }
}
