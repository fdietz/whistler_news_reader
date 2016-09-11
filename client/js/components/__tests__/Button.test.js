import renderer from 'react-test-renderer';
import React from 'react';
import Button from '../Button';

describe('Button UI', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Button>Click me</Button>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
