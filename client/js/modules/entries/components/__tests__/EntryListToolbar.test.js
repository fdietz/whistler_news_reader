import renderer from 'react-test-renderer';
import React from 'react';
import EntryListToolbar from '../EntryListToolbar';

describe('EntryListToolbar', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <EntryListToolbar
        isMobile={true}
        title="title"
        currentViewLayout="normal"
        showSpinner={false}
        isSubscriptionSelected={true}
        isCategorySelected={true}
        onMarkAsReadClick={() => {}}
        onRefreshEntriesClick={() => {}}
        onRemoveFeedOrCategoryClick={() => {}}
        onViewLayoutChangeClick={() => {}}
        onOpenEditFeedOrCategoryModalClick={() => {}}
        onToggleSidebarClick={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
