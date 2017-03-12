import React from "react";

import { Scene } from "react-native-router-flux";
import Login from "./login";

module.exports = (
    <Scene key="login" component={Login} title="Login" initial={props => props.user ? true : false} hideNavBar={true}/>
);
