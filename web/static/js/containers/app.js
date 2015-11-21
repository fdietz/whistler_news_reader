import React, { Component, PropTypes } from "react";
import InfiniteScroll from "../components/InfiniteScroll";
import { connect } from "react-redux";
import Modal from "react-modal";
import { createFeed, updateFeed, removeFeed, fetchEntries, fetchMoreEntries, selectEntry, fetchFeeds } from "../actions";

import HalfWidthFeedEntryList from "../components/HalfWidthFeedEntryList";
import Sidebar from "../components/Sidebar";
import FeedEntryContent from "../components/FeedEntryContent";

import imageProfile from "../../assets/images/profile.jpg";

class App extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.array.isRequired,
    feeds: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentEntry: PropTypes.object.isRequired,
    hasMoreEntries: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      modalIsOpen: false
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchEntries());
    dispatch(fetchFeeds());
  }

  loadMore() {
    const { dispatch, entries } = this.props;
    let oldestPublishedEntry = entries[entries.length-1].published;
    dispatch(fetchMoreEntries(oldestPublishedEntry));
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  submitAndCloseModal() {
    this.setState({modalIsOpen: false});
    console.log("new feed url", this.state.modalValue);
    const { dispatch } = this.props;
    dispatch(createFeed(this.state.modalValue));
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  handleModalChange(event) {
    this.setState({ modalValue: event.target.value })
  }

  render() {
    const { dispatch, entries, feeds, currentEntry, hasMoreEntries } = this.props;

    let content;
    if (currentEntry) {
      content = <FeedEntryContent entry={currentEntry}/>;
    }

    let items = (<HalfWidthFeedEntryList
      entries={entries}
      currentEntry={currentEntry}
      onEntryClick={entry => dispatch(selectEntry(entry)) }/>
    );

    let paginatedItems;
    if (entries.length > 0) {
      paginatedItems = (<InfiniteScroll
        threshold={300}
        loadMore={this.loadMore}
        hasMore={hasMoreEntries}
        className="scrollable-container"
        loader={<div className="loader">Loading ...</div>}>
        {items}
      </InfiniteScroll>)
    }

    const customStyles = {
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
      }
    };

    return (
      <div className="layout-container">
        <Sidebar feeds={feeds} onAddFeedClick={() => this.openModal()}/>

        <div className="layout-content with-sidebar">
          <div className="layout-list">
            <div className="list-header">
              <button className="btn btn--top-navigation">Mark as read</button>
              <button className="btn btn--top-navigation">Refresh</button>
            </div>

            {paginatedItems}
          </div>
          <div className="layout-detail">
            <div className="detail-header">
              <div className="left">
                <button className="btn btn--top-navigation">Prev</button>
                <button className="btn btn--top-navigation">Next</button>
              </div>
              <div className="right">
                <div className="avatar">
                  <img src={imageProfile}/>
                </div>
              </div>

            </div>
            {content}
          </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={() => this.closeModal()}
          style={customStyles} >

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

        </Modal>
      </div>
    );
  }
}


function select(state) {
  return {
    entries: state.entries,
    currentEntry: state.currentEntry,
    hasMoreEntries: state.hasMoreEntries,
    feeds: state.feeds,
    isLoading: state.isLoading
  };
}

export default connect(select)(App);
