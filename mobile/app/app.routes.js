import React from "react";

import { Scene } from "react-native-router-flux";
import Account from "./activities/account/account";
import Login from "./activities/login/login";
import Auth from "./components/auth/auth";

module.exports = (
  <Scene key="app">
    <Scene key="account" component={Account} title="Account" initial={true}/>
    <Scene key="login" component={Login} title="Login"/>
  </Scene>
);
