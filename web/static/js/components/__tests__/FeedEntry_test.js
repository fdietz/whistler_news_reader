import test from "ava";
import React from "react";
import { shallow } from "enzyme";
import sinon from "sinon";

import FeedEntry from "../FeedEntry";

const props = {
  id: 1,
  title: "title",
  published: "2016-01-01",
  unread: true,
  summary: "summary",
  isSelected: false,
  onClick: () => {},
  feed: {
    id: 1,
    title: "feed title"
  }
};

test("FeedEntry render correctly", t => {
  const wrapper = shallow(<FeedEntry {...props}/>);
  t.true(wrapper.find(".entry-title").text() === "title");
  t.true(wrapper.find(".feed-title").text() === "feed title");
});

test("FeedEntry render circle if selected", t => {
  const wrapper = shallow(<FeedEntry {...props} isSelected={true}/>);
  t.true(wrapper.find(".circle").length === 1);
});

test("FeedEntry fire onClick", t => {
  const spy = sinon.spy();
  const wrapper = shallow(<FeedEntry {...props} onClick={spy}/>);
  wrapper.simulate("click");
  t.true(spy.calledOnce);
});
