import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import nock from "nock";
import { expect } from "chai";

import { requestCreateFeed } from "../createFeed";
import reducer from "../createFeed";
import { CREATE_FEED } from "../createFeed";
import { ADD_FEED } from "../feeds";

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe("requestCreateFeed", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it("creates CREATE_FEED action when done", (done) => {
    const feedUrl = "http://www.theverge.com/rss/all";

    nock("http://localhost:4000/")
      .post("/api/feeds", { feed_url: feedUrl })
      .reply(201, { title: "title", id: 1 });

    const expectedActions = [
      { type: CREATE_FEED, payload: {} },
      { type: CREATE_FEED, payload: { item: { title: "title", id: 1 } } },
      { type: ADD_FEED, payload: { items: [ { title: "title", id: 1 } ] } }
    ];

    const store = mockStore({ item: {} }, expectedActions, done);
    store.dispatch(requestCreateFeed(feedUrl));
  });
});

describe("createFeed reducer", () => {
  it("returns default state", () => {
    expect(reducer(undefined, {})).to.eql({
      item: null,
      isLoading: false
    });
  });

  it("handles CREATE_FEED with empty payload", () => {
    expect(reducer(undefined, { type: CREATE_FEED })).to.eql({
      item: null,
      isLoading: true
    });
  });

  it("handles CREATE_FEED with payload", () => {
    expect(reducer(undefined, {
      type: CREATE_FEED,
      item: { title: "title", id: 1 }
    })).to.eql({
      item: null,
      isLoading: true
    });
  });
});
