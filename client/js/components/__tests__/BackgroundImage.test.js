import renderer from 'react-test-renderer';
import React from 'react';
import BackgroundImage from '../BackgroundImage';

describe('BackgroundImage', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <BackgroundImage imageUrl="hello" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
