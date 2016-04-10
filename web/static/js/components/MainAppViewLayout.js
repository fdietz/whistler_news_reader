import React, { Component, PropTypes } from "react";

import LayoutPane from "../components/LayoutPane";
import LayoutHeader from "../components/LayoutHeader";
import LayoutContent from "../components/LayoutContent";
import LayoutMasterSplit from "../components/LayoutMasterSplit";
import InfiniteScroll from "../components/InfiniteScroll";
import FeedEntryList from "../components/FeedEntryList";
import FeedEntryGrid from "../components/FeedEntryGrid";
import FeedEntryContent from "../components/FeedEntryContent";
import NoMoreContent from "../components/NoMoreContent";

import EntryContentToolbar from "../components/EntryContentToolbar";
import EntryListToolbar from "../components/EntryListToolbar";

class MainAppViewLayout extends Component {

  static propTypes = {
    entries: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isLoading: PropTypes.bool.isRequired,
      error: PropTypes.string
    }).isRequired,
    currentEntry: PropTypes.object,
    feedsActions: PropTypes.object.isRequired,
    entriesActions: PropTypes.object.isRequired,
    currentEntryActions: PropTypes.object.isRequired,
    modalsActions: PropTypes.object.isRequired,

    onNextEntryClick: PropTypes.func.isRequired,
    onPreviousEntryClick: PropTypes.func.isRequired,
    onOpenExternalClick: PropTypes.func.isRequired,
    onMarkAsReadClick: PropTypes.func.isRequired,
    onRefreshEntriesClick: PropTypes.func.isRequired,
    onRemoveFeedOrCategoryClick: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentViewLayout: "list"
    };

    this.handleEntryShown = this.handleEntryShown.bind(this);
    this.handleSelectCurrentEntry = this.handleSelectCurrentEntry.bind(this);
    this.handleViewLayoutChange = this.handleViewLayoutChange.bind(this);
  }

  handleEntryShown(entry) {
    const { entriesActions, feedsActions } = this.props;
    entriesActions.requestMarkEntryAsRead(entry).then(() => {
      feedsActions.decrementUnreadCount({ id: entry.feed.id });
    });
  }

  handleSelectCurrentEntry(entry) {
    const { currentEntryActions, modalsActions } = this.props;
    const { currentViewLayout } = this.state;

    currentEntryActions.selectEntry({ entry: entry });
    if (currentViewLayout === "grid") {
      modalsActions.openEntryContentModal();
    }
  }

  handleViewLayoutChange(value) {
    this.setState({ currentViewLayout: value });
  }

  render() {
    const { currentViewLayout } = this.state;
    const { entries, currentEntry } = this.props;
    const { modalsActions } = this.props;
    const {
      onNextEntryClick,
      onPreviousEntryClick,
      onOpenExternalClick,
      onMarkAsReadClick,
      onRefreshEntriesClick,
      onRemoveFeedOrCategoryClick,
      onLoadMore
    } = this.props;

    const content = (
      <FeedEntryContent
        entry={currentEntry.entry}
        onEntryShown={this.handleEntryShown}/>
    );

    let items;
    if (currentViewLayout === "list") {
      items = (<FeedEntryList
        entries={entries.items}
        currentEntry={currentEntry.entry}
        onEntryClick={entry => this.handleSelectCurrentEntry(entry)}/>
      );
    } else if (currentViewLayout === "compact_list") {
      items = (<FeedEntryList
        entries={entries.items}
        currentEntry={currentEntry.entry}
        onEntryClick={entry => this.handleSelectCurrentEntry(entry)}
        className="compact"/>
      );
    } else if (currentViewLayout === "grid") {
      items = (<FeedEntryGrid
        entries={entries.items}
        currentEntry={currentEntry.entry}
        onEntryClick={entry => this.handleSelectCurrentEntry(entry)}/>
      );
    } else {
      throw Error(`Unknown currentViewLayout ${currentViewLayout}`);
    }

    const paginatedItems = (<InfiniteScroll
      threshold={300}
      loadMore={onLoadMore}
      hasMore={entries.hasMoreEntries}>
      {entries.items.length > 0 && items}
      {!entries.hasMoreEntries && <NoMoreContent/>}
    </InfiniteScroll>);


    const listHeader = (
      <LayoutHeader>
        <EntryListToolbar
          currentViewLayout={currentViewLayout}
          entries={entries}
          onMarkAsReadClick={onMarkAsReadClick}
          onRefreshEntriesClick={onRefreshEntriesClick}
          onRemoveFeedOrCategoryClick={onRemoveFeedOrCategoryClick}
          onViewLayoutChangeClick={this.handleViewLayoutChange}
          onOpenEditFeedOrCategoryModalClick={modalsActions.openEditFeedOrCategoryModal}
          onPreviousEntryClick={onPreviousEntryClick}
          onNextEntryClick={onNextEntryClick}
          onOpenExternalClick={onOpenExternalClick}
          onOpenEntryContentModalClick={modalsActions.openEntryContentModal}
          />

      </LayoutHeader>
    );

    const entryHeader = (
      <LayoutHeader>
        <EntryContentToolbar
          onPreviousEntryClick={onPreviousEntryClick}
          onNextEntryClick={onNextEntryClick}
          onOpenExternalClick={onOpenExternalClick}
          onOpenEntryContentModalClick={modalsActions.openEntryContentModal}
          />
      </LayoutHeader>
    );

    return (
      <div className="main-app-view-layout">
        {currentViewLayout === "list" &&
          <LayoutMasterSplit>
            <LayoutPane size={30}>
              {listHeader}
              <LayoutContent>{paginatedItems}</LayoutContent>
            </LayoutPane>
            <LayoutPane size={70}>
              {entryHeader}
              <LayoutContent>{currentEntry.entry && content}</LayoutContent>
            </LayoutPane>
          </LayoutMasterSplit>
        }
        {currentViewLayout === "compact_list" &&
          <LayoutMasterSplit>
            <LayoutPane size={30}>
              {listHeader}
              <LayoutContent>{paginatedItems}</LayoutContent>
            </LayoutPane>
            <LayoutPane size={70}>
              {entryHeader}
              <LayoutContent>{currentEntry.entry && content}</LayoutContent>
            </LayoutPane>
          </LayoutMasterSplit>
        }
        {currentViewLayout === "grid" &&
          <LayoutMasterSplit>
            <LayoutPane size={100}>
              {listHeader}
              <LayoutContent>{paginatedItems}</LayoutContent>
            </LayoutPane>
          </LayoutMasterSplit>
        }
      </div>
    );
  }
}

export default MainAppViewLayout;
