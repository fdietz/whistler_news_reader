import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import FeedEntryListItem from '../FeedEntryListItem';

const entry = {
  id: 1,
  title: 'title',
  published: '2016-01-01',
  unread: true,
  summary: 'summary',
  subscription_id: 1,
  subscription_title: 'feed title',
};

const props = {
  entry: entry,
  isSelected: false,
  onClick: () => {},
};

test('FeedEntryListItem render correctly', t => {
  const wrapper = shallow(<FeedEntryListItem {...props} />);
  t.true(wrapper.find('.entry-title').text() === 'title');
  t.true(wrapper.find('.feed-title').text() === 'feed title');
});

test('FeedEntryListItem render circle if selected', t => {
  const wrapper = shallow(<FeedEntryListItem {...props} isSelected />);
  t.true(wrapper.find('.circle').length === 1);
});

test('FeedEntryListItem fire onClick', t => {
  const spy = sinon.spy();
  const wrapper = shallow(<FeedEntryListItem {...props} onClick={spy} />);
  wrapper.simulate('click');
  t.true(spy.calledOnce);
});
