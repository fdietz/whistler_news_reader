import React from "react";
import { Route } from "react-router";

// import Welcome from "../containers/Welcome";
import MainApp from "../containers/MainApp";
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
     <Route path="all" component={MainApp}/>
     <Route path="today" component={MainApp}/>
     <Route path="feeds/:id" component={MainApp}/>
     <Route path="categories/:id" component={MainApp}/>
    </Route>

   <Route path="patterns" component={Patterns}/>
 </Route>
);
