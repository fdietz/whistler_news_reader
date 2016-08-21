import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import Teaser from '../Teaser';

test('Component renders', t => {
  const wrapper = shallow(
    <Teaser />
  );
  t.is(1, wrapper.length);
});
