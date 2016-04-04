// import test from "ava";
// import React from "react";
// import { shallow, mount } from "enzyme";
// import Sidebar from "../Sidebar";
// import Feed from "../Feed";
// import Category from "../Category";
//
// const props = {
//   feeds: [
//     { id: 1, title: "feed title 1", category_id: 1, unread_count: 1 },
//     { id: 2, title: "feed title 2", category_id: 1, unread_count: 2 }
//   ],
//   categories: [
//     { id: 1, title: "category title" }
//   ],
//   currentPathname: "/feeds/1",
//   currentUser: {
//     id: 1,
//     first_name: "John",
//     last_name: "Doe"
//   },
//   onAddClick: () => {},
//   onSignOutClick: () => {},
//   onNextClick: () => {},
//   onPreviousClick: () => {},
//   onCategoryExpandClick: () => {},
//   onAddCategoryClick: () => {},
//   onFeedDrop: () => {}
// };
//
// test("Category renders correctly", t => {
//   const wrapper = shallow(<Sidebar {...props}/>);
//   console.log(wrapper.debug())
//   t.same(wrapper.find(Category).length, 1);
//   t.same(wrapper.find(Feed).length, 2);
// });
