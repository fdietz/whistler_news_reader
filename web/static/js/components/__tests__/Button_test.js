import React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import Button from "../Button";

describe("Button", () => {
  it("render children", () => {
    const wrapper = shallow(<Button>Click me</Button>).contains("Click me");
    expect(wrapper).to.equal(true);
  });

  it("set className from props", () => {
    const wrapper = shallow(<Button type="btn-header"/>);
    expect(wrapper.is(".btn-header")).to.equal(true);
  });
});
