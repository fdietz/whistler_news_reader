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
  image_url: 'test'
};

const props = {
  entry,
  isSelected: false,
  onClick: () => {},
};

test('EntryListItem render correctly', () => {
  const wrapper = shallow(<EntryListItem {...props} />);
  expect(wrapper.find('.entry-title').text() === 'title').toBe(true);
  expect(wrapper.find('.feed-title').text() === 'feed title').toBe(true);
});

test('EntryListItem fire onClick', () => {
  const spy = sinon.spy();
  const wrapper = shallow(<EntryListItem {...props} onClick={spy} />);
  wrapper.simulate('click');
  expect(spy.calledOnce).toBe(true);
});
