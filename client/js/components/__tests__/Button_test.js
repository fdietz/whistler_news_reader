import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Button from '../Button';

test('Button render children', t => {
  const wrapper = shallow(<Button>Click me</Button>);
  t.true(wrapper.contains('Click me'));
});

test('Button set className from props', t => {
  const wrapper = shallow(<Button type="header" />);
  t.true(wrapper.is('.btn-header'));
});

test('Button click event', t => {
  const onClick = sinon.spy();
  const wrapper = shallow(<Button onClick={onClick}>Click me</Button>);
  wrapper.find('button').simulate('click');
  t.true(onClick.calledOnce);
});
