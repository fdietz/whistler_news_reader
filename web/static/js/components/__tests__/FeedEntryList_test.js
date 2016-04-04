import test from "ava";
import React from "react";
import { shallow } from "enzyme";
import FeedEntryList from "../FeedEntryList";
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

test("FeedEntryList renders correctly", t => {
  const wrapper = shallow(<FeedEntryList entries={[props]} currentEntry={props} onEntryClick={() => {}}/>);
  const feedEntry = wrapper.find(FeedEntry);
  t.same(feedEntry.prop("title"), "title");
});
