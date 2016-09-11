import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Button from '../Button';

describe('Button UX', () => {
  it('Button click event', () => {
    const onClick = sinon.spy();
    const wrapper = shallow(<Button onClick={onClick}>Click me</Button>);
    wrapper.find('button').simulate('click');
    expect(onClick.calledOnce).toBe(true);
  });
});
