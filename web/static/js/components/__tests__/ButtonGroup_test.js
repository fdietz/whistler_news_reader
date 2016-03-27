import test from "ava";
import React from "react";
import { shallow } from "enzyme";
import ButtonGroup from "../ButtonGroup";
import Button from "../Button";

test("ButtonGroup render children", t => {
  const wrapper = shallow(<ButtonGroup className="a"><Button type="primary">Hello</Button></ButtonGroup>);
  console.log(wrapper.html())
  const result = wrapper.contains(<button className="btn primary">Hello</button>);
  t.true(result);
});

test("ButtonGroup className", t => {
  const wrapper = shallow(<ButtonGroup className="test"><Button>Hello</Button></ButtonGroup>);
  t.true(wrapper.is(".btn-group"));
});
