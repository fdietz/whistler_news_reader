import React, { Component } from "react";
import { connect } from 'react-redux';
import { create_feed, update_feed, remove_feed, fetchEntries } from "../actions";

import TopHeader from "../components/TopHeader";
import MainHeader from "../components/MainHeader";
import FeedEntryList from "../components/FeedEntryList";
import Sidebar from "../components/Sidebar";

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch(fetchEntries());
  }

  loadMore() {
    let { dispatch } = this.props;
    // TODO: fetch with pagination
    // let oldestPublishedEntry = this.state.entries[this.state.entries.length-1].published;
    // { last_published: oldestPublishedEntry }
    dispatch(fetchEntries());
  }

  render() {
    const { dispatch, entries, feeds, isLoading } = this.props;

    let buttonLabel = "Load More";
    if (isLoading) {
      buttonLabel = "loading...";
    }

    return (
      <div className="container">
        <MainHeader/>
        <Sidebar/>

        <div className="content with-sidebar">
          <MainHeader/>
          <FeedEntryList entries={entries}/>
          <div className="paginator">
            <button className="btn btn-primary" onClick={() => this.loadMore}>{buttonLabel}</button>
          </div>
        </div>

      </div>
    );
  }
}

function select(state) {
  console.log("select", state)
  return {
    entries: state.entries,
    feeds: state.feeds,
    isLoading: state.isLoading
  };
}

export default connect(select)(App);
