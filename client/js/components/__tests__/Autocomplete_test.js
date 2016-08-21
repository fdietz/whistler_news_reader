import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import Autocomplete from '../Autocomplete';

test('Component renders', t => {
  const wrapper = shallow(
    <Autocomplete
      placeholder="hello"
      items={[]}
      onChange={() => {}}
      onSelect={() => {}} />
  );
  t.is(1, wrapper.length);
});
