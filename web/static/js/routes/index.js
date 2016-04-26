import React from "react";
import { Route, IndexRedirect, IndexRoute } from "react-router";

import Patterns from "../containers/Patterns";

import RootLayout from "../containers/RootLayout";
import SignUp from "../containers/SignUp";
import SessionNew from "../containers/SessionNew";
import AuthenticatedContainer from "../containers/AuthenticatedContainer";
import EntryListContainer from "../containers/EntryListContainer";
import EntryDetailContainer from "../containers/EntryDetailContainer";
import MainAppContainer from "../containers/MainAppContainer";

import EditDialog from "../containers/EditDialog";
import NewFeedDialog from "../containers/NewFeedDialog";
import NewCategoryDialog from "../containers/NewCategoryDialog";
import OpmlImportDialog from "../containers/OpmlImportDialog";

const entriesRoute = (
<Route path="entries" component={EntryListContainer}>
  <Route path=":id" component={EntryDetailContainer}/>
</Route>
);

export default (store) => (
  <Route component={RootLayout}>

    <Route path="/sign_up" component={SignUp}/>
    <Route path="/sign_in" component={SessionNew}/>

    <Route path="/" component={AuthenticatedContainer}>
      <IndexRedirect to="all"/>

      <Route component={MainAppContainer}>
        <Route path="/feeds/new" component={NewFeedDialog}/>
        <Route path="/categories/new" component={NewCategoryDialog}/>
        <Route path="/opml_import" component={OpmlImportDialog}/>
      </Route>

      <Route path="all" component={MainAppContainer}>
        <IndexRedirect to="entries"/>
        {entriesRoute}
      </Route>
      <Route path="today" component={MainAppContainer}>
        <IndexRedirect to="entries"/>
        {entriesRoute}
      </Route>
      <Route path="subscriptions/:subscription_id" component={MainAppContainer}>
        <IndexRedirect to="entries"/>
        {entriesRoute}
        <Route path="edit" component={EditDialog}/>
      </Route>
      <Route path="categories/:category_id" component={MainAppContainer}>
        <IndexRedirect to="entries"/>
        {entriesRoute}
        <Route path="edit" component={EditDialog}/>
      </Route>
    </Route>

    <Route path="patterns" component={Patterns}/>
  </Route>
);
