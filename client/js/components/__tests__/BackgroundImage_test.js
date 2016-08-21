import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import BackgroundImage from '../BackgroundImage';

test('Component renders', t => {
  const wrapper = shallow(
    <BackgroundImage imageUrl="hello" />
  );
  t.is(1, wrapper.length);
});
