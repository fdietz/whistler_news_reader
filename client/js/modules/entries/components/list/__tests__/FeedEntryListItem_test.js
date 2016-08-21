import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import EntryListItem from '../EntryListItem';

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
  entry,
  isSelected: false,
  onClick: () => {},
};

test('EntryListItem render correctly', t => {
  const wrapper = shallow(<EntryListItem {...props} />);
  t.true(wrapper.find('.entry-title').text() === 'title');
  t.true(wrapper.find('.feed-title').text() === 'feed title');
});

test('EntryListItem fire onClick', t => {
  const spy = sinon.spy();
  const wrapper = shallow(<EntryListItem {...props} onClick={spy} />);
  wrapper.simulate('click');
  t.true(spy.calledOnce);
});
