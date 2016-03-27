import test from "ava";
import React from "react";
import { shallow } from "enzyme";
import Badge from "../Badge";

test("Badge render count", t => {
  const wrapper = shallow(<Badge count={1}/>);
  t.true(wrapper.contains(1));
});

test("Badge render count 99+ if large", t => {
  const wrapper = shallow(<Badge count={100}/>);
  t.true(wrapper.contains("99+"));
});
