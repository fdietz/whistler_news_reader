import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";

import LayoutPane from "../components/LayoutPane";
import LayoutHeader from "../components/LayoutHeader";
import LayoutContent from "../components/LayoutContent";
import LayoutMasterSplit from "../components/LayoutMasterSplit";

import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Icon from "../components/Icon";

import InfiniteScroll from "../components/InfiniteScroll";
import FeedEntryList from "../components/FeedEntryList";
import FeedEntryContent from "../components/FeedEntryContent";

import {
  requestFetchEntries,
  requestFetchMoreEntries,
  requestRefreshEntries,
  requestMarkEntryAsRead
} from "../redux/modules/entries";

import { selectEntry } from "../redux/modules/currentEntry";
import createFeedAction from "../redux/actions/createFeedAction";
import { createFeedResetForm } from "../redux/modules/createFeed";

class Entries extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    createFeed: PropTypes.object,
    currentEntry: PropTypes.object,
    location: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      newFeedModalIsOpen: false,
      feedUrl: ""
    };

    this.loadMore = this.loadMore.bind(this);
    this.refreshEntries = this.refreshEntries.bind(this);
    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);
    // this.createFeed = this.createFeed.bind(this);
    this.openNewFeedModal = this.openNewFeedModal.bind(this);
    this.closeNewFeedModal = this.closeNewFeedModal.bind(this);
    this.handleNewFeedChange = this.handleNewFeedChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleEntryShown = this.handleEntryShown.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(requestFetchEntries(this.requestParams(this.props)));
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;

    // if we changed routes...
    if (nextProps.location.key !== this.props.location.key) {
      dispatch(requestFetchEntries(this.requestParams(nextProps)));
    }
  }

  requestParams(props) {
    if (props.params.id) {
      return { feed_id: props.params.id };
    } else if (props.location.pathname === "/all") {
      return { feed_id: "all" };
    } else if (props.location.pathname === "/today") {
      return { feed_id: "today" };
    }

    return {};
  }

  loadMore() {
    const { dispatch, entries } = this.props;
    if (entries.hasMoreEntries && !entries.isLoading) {
      let oldestPublishedEntry = entries.items[entries.items.length-1].published;
      let params = Object.assign(this.requestParams(this.props), {
        last_published: oldestPublishedEntry
      });
      dispatch(requestFetchMoreEntries(params));
    }
  }

  refreshEntries() {
    const { dispatch } = this.props;
    dispatch(requestRefreshEntries(this.requestParams(this.props)));
  }

  nextEntry() {
    const { dispatch, entries } = this.props;
    if (this.isNextEntry()) {
      const entry = entries.items[this.currentIndex()+1];
      dispatch(selectEntry({ entry: entry }));
    }
  }

  isNextEntry() {
    const { entries } = this.props;
    return this.currentIndex()+1 < entries.items.length;
  }

  currentIndex() {
    const { entries, currentEntry } = this.props;
    return currentEntry ? entries.items.indexOf(currentEntry) : 0;
  }

  previousEntry() {
    const { dispatch, entries } = this.props;
    if (this.isPreviousEntry()) {
      const entry = entries.items[this.currentIndex()-1];
      dispatch(selectEntry({ entry: entry }));
    }
  }

  isPreviousEntry() {
    return this.currentIndex()-1 >= 0;
  }

  openNewFeedModal() {
    this.setState({ newFeedModalIsOpen: true });
  }

  closeNewFeedModal(event) {
    const { dispatch } = this.props;

    this.setState({ newFeedModalIsOpen: false });
    if (event) event.preventDefault();
    dispatch(createFeedResetForm());
  }

  handleNewFeedChange(event) {
    this.setState({ feedUrl: event.target.value });
  }

  submitForm(event) {
    const { dispatch} = this.props;
    event.preventDefault();

    dispatch(createFeedAction(this.state.feedUrl)).then((result) => {
      if (!result.errors) {
        this.setState({ feedUrl: "" });
        this.closeNewFeedModal();
      }
    });
  }

  handleEntryShown(entry) {
    const { dispatch} = this.props;
    dispatch(requestMarkEntryAsRead(entry));
  }

  render() {
    const { dispatch, entries, currentEntry } = this.props;

    let content;
    if (currentEntry) {
      content = (
        <FeedEntryContent
          entry={currentEntry}
          onEntryShown={this.handleEntryShown}/>
      );
    }

    let items = (<FeedEntryList
      entries={entries.items}
      currentEntry={currentEntry}
      onEntryClick={entry => dispatch(selectEntry({ entry: entry })) }/>
    );

    let paginatedItems;
    if (entries.items.length > 0) {
      let noMoreContent;
      if (!entries.hasMoreEntries) {
        noMoreContent = (
          <div className="item no-more-content">
            <p className="hint">No more contents. You are all done!</p>
            <div className="smile">:-)</div>
          </div>
        );
      }

      paginatedItems = (<InfiniteScroll
        threshold={300}
        loadMore={this.loadMore}
        hasMore={entries.hasMoreEntries}>
        {items}
        {noMoreContent}
      </InfiniteScroll>);
    }

    const customStyles = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)"
      },
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        border: "2",
        borderRadius: "2px",
        padding: 0
      }
    };

    return (
      <LayoutMasterSplit>
        <LayoutPane size={30}>
          <LayoutHeader>
            <ButtonGroup>
              <Button type="btn-header">
                <Icon name="checkmark" size="small"/>
              </Button>
              <Button type="btn-header" onClick={this.refreshEntries}>
                <Icon name="cycle" size="small"/>
              </Button>
            </ButtonGroup>
          </LayoutHeader>
          <LayoutContent>
            {paginatedItems}
          </LayoutContent>
        </LayoutPane>
        <LayoutPane size={70}>
          <LayoutHeader>
            <ButtonGroup>
              <Button type="btn-header" onClick={this.previousEntry}>
                <Icon name="arrow-left3" size="small"/>
              </Button>
              <Button type="btn-header" onClick={this.nextEntry}>
                <Icon name="arrow-right3" size="small"/>
              </Button>
            </ButtonGroup>
            <ButtonGroup className="mx-l-auto">
              <Button type="btn-header" onClick={this.openNewFeedModal}>
                <Icon name="plus" size="small"/>
              </Button>
            </ButtonGroup>
          </LayoutHeader>
          <LayoutContent>
            {content}
          </LayoutContent>
        </LayoutPane>

        <Modal
          isOpen={this.state.newFeedModalIsOpen}
          onRequestClose={this.closeNewFeedModal}
          style={customStyles}>

          <div className="modal-header">
            <h2>Add new feed</h2>
            <a className="modal-close-link" onClick={this.closeNewFeedModal}>
              <Icon name="cross"/>
            </a>
          </div>

          <div className="modal-content">
            <form onSubmit={this.submitForm} className="form-prominent2">
              <input className="field"
                type="text"
                placeholder="Website or feed"
                value={this.state.feedUrl}
                onChange={(event) => this.handleNewFeedChange(event)}
                autoFocus={true}/>
              {this.props.createFeed &&
                this.props.createFeed.errors &&
                this.props.createFeed.errors[0]["feed_url"] &&
                <p>
                  Error creating feed:
                  {this.props.createFeed.errors[0]["feed_url"]}
                </p>
              }
            </form>
          </div>

          <div className="modal-footer">
            <button
              onClick={this.closeNewFeedModal}
              className="btn">Close</button>
            <button
              type="submit"
              className="btn btn-primary bg-blue white"
              disabled={!this.state.feedUrl}
              onClick={this.submitForm}>Add Feed</button>
          </div>
        </Modal>
      </LayoutMasterSplit>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    entries: state.entries,
    currentEntry: state.currentEntry,
    createFeed: state.createFeed,
    location: ownProps.location
  };
}

export default connect(mapStateToProps)(Entries);
