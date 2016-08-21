import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import Dropdown from '../Dropdown';

test('Component renders', t => {
  const wrapper = shallow(
    <Dropdown />
  );
  t.is(1, wrapper.length);
});
