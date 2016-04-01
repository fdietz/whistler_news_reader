import test from "ava";
import React from "react";
import { shallow } from "enzyme";
import FeedEntryList from "../FeedEntryList";
import FeedEntry from "../FeedEntry";

// test("FeedEntryList render count", t => {
//   const props = { id: 1, title: "title", published: "2016-01-01", unread: true, summary: "summary", isSelected: true, onClick: () => {}, feed: { id: 1 }};
//   const wrapper = shallow(<FeedEntryList entries={[props]} currentEntry={props} onEntryClick={() => {}}></FeedEntryList>);
//   t.true(wrapper.contains("Test"));
// });
