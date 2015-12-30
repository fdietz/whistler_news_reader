import React, {Component, PropTypes} from "react";
import { pushState } from "redux-router";
import { connect } from "react-redux";

import { requestCreateFeed } from "../redux/modules/createFeed";

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

    this.setFeed = this.setFeed.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, returnTo } = this.props;

    console.log("componentWillReceiveProps", nextProps)
    if (nextProps && nextProps.createFeed && nextProps.createFeed.item) {
      // navigate to new feed url
      dispatch(pushState(null, `/feeds/${nextProps.createFeed.item.id}`));
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

  setFeed(feedUrl) {
    const { dispatch } = this.props;
    dispatch(requestCreateFeed(feedUrl));
    event.preventDefault();
  }

  render() {
    const { createFeed } = this.props;
    let error;
    if (createFeed.error) {
      error = (
        <div className="form-message">Error adding feed: {createFeed.error}</div>
      );
    }

    const links = [
      { name: "TechCrunch", feedUrl: "http://feeds.feedburner.com/techcrunch" },
      { name: "BoingBoind", feedUrl: "http://feeds.feedburner.com/boingboing/ibag" }
    ];

    return (
      <div className="modal-body">
        <div className="modal-header">
          <h2>Add Feed</h2>
        </div>
        <div className="modal-content">
          <form className="form-prominent">
            <label className="hint">Enter website or feed address here.</label>
            <input className="field mt2 mb2"
                type="text"
                placeholder="Website or feed"
                value={this.state.feedUrl}
                onChange={(event) => this.handleChange(event)}
                autoFocus/>
              {error}

            <div className="clearfix">

            <label className="hint">Or pick from our great proposals.</label>
            <ul>
              {links.map((link) => {
                return (
                  <li key={link.feedUrl}>
                    <a onClick={() => this.setFeed(link.feedUrl)}>{link.name}</a>
                  </li>
                );
              })}
            </ul>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={() => this.cancel()}
            className="btn">Close</button>
          <button type="submit"
            className="btn btn-primary bg-blue white"
            onClick={(event) => this.submitForm(event)}>Add Feed</button>
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
