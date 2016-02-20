import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "../containers/App";
import Welcome from "../containers/Welcome";
import Entries from "../containers/Entries";
import NewFeedModal from "../containers/NewFeedModal";
import Patterns from "../containers/Patterns";

export default (store) => (
 <Route path="/" component={App}>
   <IndexRoute component={Welcome}/>
   <Route path="all" component={Entries}/>
   <Route path="today" component={Entries}/>
   <Route path="feeds/new" component={NewFeedModal} modal={true}/>
   <Route path="feeds/:id" component={Entries}/>
   <Route path="patterns" component={Patterns}/>
 </Route>
);
