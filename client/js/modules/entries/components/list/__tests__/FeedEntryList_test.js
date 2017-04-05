import React from 'react';
import { shallow } from 'enzyme';
import EntryList from '../EntryList';
import EntryListItem from '../EntryListItem';

const entry = {
  id: 1,
  title: 'title',
  published: '2016-01-01',
  unread: true,
  summary: 'summary',
  image_url: 'url',
  feed: {
    id: 1,
    title: 'feed title',
  },
};

test('EntryList renders correctly', () => {
  const wrapper = shallow(
    <EntryList entries={[entry]} currentEntry={entry} onEntryClick={() => {}} />
  );
  const feedEntry = wrapper.find(EntryListItem);
  expect(feedEntry.prop('entry').title).toEqual('title');
});
