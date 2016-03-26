import test from "ava";
import React from "react";
import { shallow } from "enzyme";
import Button from "../Button";

test("Button render children", t => {
  const wrapper = shallow(<Button>Click me</Button>).contains("Click me");
  t.true(wrapper);
});

test("Button set className from props", t => {
  const wrapper = shallow(<Button type="btn-header"/>);
  t.true(wrapper.is(".btn-header"));
});
