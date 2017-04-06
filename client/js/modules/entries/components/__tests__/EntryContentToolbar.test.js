import renderer from 'react-test-renderer';
import React from 'react';
import EntryContentToolbar from '../EntryContentToolbar';

describe('EntryContentToolbar', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <EntryContentToolbar
        isMobile={true}
        showSpinner={false}
        currentViewMode="normal"
        hasPreviousEntry={true}
        hasNextEntry={true}
        onPreviousEntryClick={() => {}}
        onNextEntryClick={() => {}}
        onOpenExternalClick={() => {}}
        onGoBackClick={() => {}}
        onChangeViewModeClick={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
