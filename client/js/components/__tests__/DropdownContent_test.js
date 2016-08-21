import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import DropdownContent from '../DropdownContent';

test('Component renders', t => {
  const wrapper = shallow(
    <DropdownContent />
  );
  t.is(1, wrapper.length);
});
