import renderer from 'react-test-renderer';
import React from 'react';
import DropdownTrigger from '../DropdownTrigger';

describe('DropdownTrigger', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<DropdownTrigger />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
