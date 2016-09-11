import renderer from 'react-test-renderer';
import React from 'react';
import DropdownContent from '../DropdownContent';

describe('DropdownContent', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<DropdownContent />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
