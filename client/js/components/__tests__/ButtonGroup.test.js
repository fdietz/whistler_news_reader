import renderer from 'react-test-renderer';
import React from 'react';
import ButtonGroup from '../ButtonGroup';
import Button from '../Button';

describe('ButtonGroup', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <ButtonGroup className="a">
        <Button type="primary">Hello</Button>
      </ButtonGroup>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
