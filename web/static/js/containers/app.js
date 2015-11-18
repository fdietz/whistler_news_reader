import React, { Component } from "react";
import { connect } from 'react-redux';
import { create_feed, update_feed, remove_feed, fetchEntries } from "../actions";

import TopHeader from "../components/TopHeader";
import FeedEntryList from "../components/FeedEntryList";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    let { dispatch } = this.props;
    dispatch(fetchEntries());
  }

  loadMore() {
    let { dispatch } = this.props;
    dispatch(fetchEntries());

    // let oldestPublishedEntry = this.state.entries[this.state.entries.length-1].published;
    // this.setState({ loadMoreLoading: true });
    // $.get("/api/entries/news", { last_published: oldestPublishedEntry }, function(result) {
    //   this.setState({
    //     entries: this.state.entries.concat(result.entries),
    //     loadMoreLoading: false
    //   });
    // }.bind(this));
  }

  render() {
    const { dispatch } = this.props;

    let buttonLabel = "Load More";
    if (this.state.loadMoreLoading) {
      buttonLabel = "loading...";
    }

    return (
      <div>
        <TopHeader/>
        <FeedEntryList entries={this.state.entries} onLoadMore={this.loadMore}/>
        <div className="paginator">
          <button className="btn btn-primary" onClick={this.loadMore}>{buttonLabel}</button>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    entries: state.entries,
    feeds: state.feeds,
    isLoading: state.isLoading
  };
}

export default connect(select)(App);
