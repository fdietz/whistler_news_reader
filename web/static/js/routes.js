import React from "react";
import { Route, IndexRoute } from "react-router";
// import { Route, Redirect, IndexRoute } from "react-router";

import Root from "./containers/Root";
import Welcome from "./containers/Welcome";
import Entries from "./containers/Entries";
import NewFeedModal from "./containers/NewFeedModal";
import Patterns from "./containers/Patterns";

export default function createRoutes() {
  return (
   <Route path="/" component={Root}>
     <IndexRoute component={Welcome}/>
     <Route path="all" component={Entries}/>
     <Route path="today" component={Entries}/>
     <Route path="feeds/new" component={NewFeedModal} modal={true}/>
     <Route path="feeds/:id" component={Entries}/>
     <Route path="patterns" component={Patterns}/>
   </Route>
 );
}
