import React from "react";
import { Route, IndexRoute } from "react-router";

import App from "../containers/App";
import Welcome from "../containers/Welcome";
import Entries from "../containers/Entries";
import NewFeedModal from "../containers/NewFeedModal";
import Patterns from "../containers/Patterns";

import MainLayout from "../containers/MainLayout";
import SignUp from "../containers/SignUp";
import SessionNew from "../containers/SessionNew";
import AuthenticatedContainer from "../containers/AuthenticatedContainer";

export default (store) => (
 <Route component={MainLayout}>

   <Route path="/sign_up" component={SignUp}/>
   <Route path="/sign_in" component={SessionNew}/>

   <Route path="/" component={AuthenticatedContainer}>
     <Route path="all" component={Entries}/>
     <Route path="today" component={Entries}/>
     <Route path="feeds/new" component={NewFeedModal} modal={true}/>
     <Route path="feeds/:id" component={Entries}/>
     <Route path="patterns" component={Patterns}/>
    </Route>
 </Route>
);
