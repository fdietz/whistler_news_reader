import React, {Component, PropTypes} from "react";
import { connect } from "react-redux";
import { pushState } from "redux-router";

import { requestCreateFeed } from "../redux/modules/createFeed";
import MainHeader from "../components/MainHeader";

export default class NewFeed extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    createFeed: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { feedUrl: "" };
  }

  handleChange(event) {
    this.setState({ feedUrl: event.target.value });
  }

  submitForm(event) {
    const { dispatch} = this.props;
    dispatch(requestCreateFeed(this.state.feedUrl));

    event.preventDefault();
  }

  cancel() {
    const { dispatch } = this.props;
    dispatch(pushState(null, "/"));
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
      <div className="layout-content with-sidebar layout-vertical">
        <MainHeader/>
        <div className="layout-full">
          <form className="form form-stacked form-prominent"
            onSubmit={(event) => this.submitForm(event)}>
            <fieldset>
              <legend>Add Feed</legend>

              {error}

              <input className="pure-input-1"
                  type="text"
                  placeholder="Enter feed url"
                  value={this.state.feedUrl}
                  onChange={(event) => this.handleChange(event)}
                  autoFocus/>
              <button type="submit" className="btn btn--blue">Add Feed</button>
              <button onClick={() => this.cancel()}
                className="btn">close</button>
            </fieldset>
          </form>
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

export default connect(mapStateToProps)(NewFeed);
