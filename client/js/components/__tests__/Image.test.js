import renderer from 'react-test-renderer';
import React from 'react';
import Image from '../Image';

describe('Image', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Image imageUrl="hello" />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
