import test from "ava";
import React from "react";
import { shallow } from "enzyme";
import FeedEntryList from "../FeedEntryList";
import FeedEntryListItem from "../FeedEntryListItem";

const entry = {
  id: 1,
  title: "title",
  published: "2016-01-01",
  unread: true,
  summary: "summary",
  feed: {
    id: 1,
    title: "feed title"
  }
};

test("FeedEntryList renders correctly", t => {
  const wrapper = shallow(<FeedEntryList entries={[entry]} currentEntry={entry} onEntryClick={() => {}}/>);
  const feedEntry = wrapper.find(FeedEntryListItem);
  t.deepEqual(feedEntry.prop("entry").title, "title");
});
