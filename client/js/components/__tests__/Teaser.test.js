import renderer from 'react-test-renderer';
import React from 'react';
import Teaser from '../Teaser';

describe('Teaser', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Teaser />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
