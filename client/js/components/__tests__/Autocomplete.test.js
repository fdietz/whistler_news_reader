import renderer from 'react-test-renderer';
import React from 'react';
import Autocomplete from '../Autocomplete';

describe('Autocomplete', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Autocomplete
        placeholder="hello"
        items={[]}
        onChange={() => {}}
        onSelect={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
