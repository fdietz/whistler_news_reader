import renderer from 'react-test-renderer';
import React from 'react';
import Dropdown from '../Dropdown';

describe('Dropdown', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Dropdown />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
