import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import ButtonGroup from '../ButtonGroup';
import Button from '../Button';

test('ButtonGroup render children', t => {
  const wrapper = shallow(<ButtonGroup className="a"><Button type="primary">Hello</Button></ButtonGroup>);
  t.true(wrapper.find(Button).length === 1);
});
