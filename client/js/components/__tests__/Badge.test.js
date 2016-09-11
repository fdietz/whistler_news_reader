import renderer from 'react-test-renderer';
import React from 'react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Badge count={1} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders count 99+ if large', () => {
    const tree = renderer.create(<Badge count={100} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
