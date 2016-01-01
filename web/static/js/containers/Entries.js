import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { pushState } from "redux-router";


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
  requestRefreshEntries
} from "../redux/modules/entries";

import { selectEntry } from "../redux/modules/currentEntry";

class Entries extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    entries: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    currentEntry: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
    this.refreshEntries = this.refreshEntries.bind(this);
    this.nextEntry = this.nextEntry.bind(this);
    this.previousEntry = this.previousEntry.bind(this);
    this.createFeed = this.createFeed.bind(this);
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

  createFeed() {
    const { dispatch } = this.props;
    dispatch(pushState({ modal: true, returnTo: this.props.location.pathname }, "/feeds/new"));
  }

  render() {
    const { dispatch, entries, currentEntry } = this.props;

    let content;
    if (currentEntry) {
      content = (<FeedEntryContent entry={currentEntry}/>);
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

    return (
      <LayoutMasterSplit>
        <LayoutPane size={30}>
          <LayoutHeader>
            <ButtonGroup>
              <Button type="btn-header">
                <Icon name="checkmark" size="small"/>
              </Button>
              <Button type="btn-header" onClick={this.refreshEntries}>
                <Icon name="refresh" size="small"/>
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
          </LayoutHeader>
          <LayoutContent>
            {content}
          </LayoutContent>
        </LayoutPane>
      </LayoutMasterSplit>
    );
  }
}

function mapStateToProps(state) {
  return {
    entries: state.entries,
    currentEntry: state.currentEntry
  };
}

export default connect(mapStateToProps)(Entries);
