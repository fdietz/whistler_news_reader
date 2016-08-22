import test from 'ava';
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
  feed: {
    id: 1,
    title: 'feed title',
  },
};

test('EntryList renders correctly', t => {
  const wrapper = shallow(
    <EntryList entries={[entry]} currentEntry={entry} onEntryClick={() => {}} />
  );
  const feedEntry = wrapper.find(EntryListItem);
  t.deepEqual(feedEntry.prop('entry').title, 'title');
});
