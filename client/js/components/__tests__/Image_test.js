import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import Image from '../Image';

test('Component renders', t => {
  const wrapper = shallow(
    <Image imageUrl="hello" />
  );
  t.is(1, wrapper.length);
});
