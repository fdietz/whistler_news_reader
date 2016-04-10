import React from "react";
import { Route, IndexRedirect } from "react-router";

import MainApp from "../containers/MainApp";
import Patterns from "../containers/Patterns";

import RootLayout from "../containers/RootLayout";
import SignUp from "../containers/SignUp";
import SessionNew from "../containers/SessionNew";
import AuthenticatedContainer from "../containers/AuthenticatedContainer";

export default (store) => (
 <Route component={RootLayout}>

   <Route path="/sign_up" component={SignUp}/>
   <Route path="/sign_in" component={SessionNew}/>


   <Route path="/" component={AuthenticatedContainer}>
     <IndexRedirect to="/all"/>

     <Route path="/all" component={MainApp}/>
     <Route path="/today" component={MainApp}/>
     <Route path="/feeds/:id" component={MainApp}/>
     <Route path="/categories/:id" component={MainApp}/>
    </Route>

   <Route path="patterns" component={Patterns}/>
 </Route>
);
