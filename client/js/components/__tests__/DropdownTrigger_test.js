import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import DropdownTrigger from '../DropdownTrigger';

test('Component renders', t => {
  const wrapper = shallow(
    <DropdownTrigger />
  );
  t.is(1, wrapper.length);
});
