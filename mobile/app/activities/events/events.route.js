import React from "react";

import { Scene } from "react-native-router-flux";
import events from "./events";

module.exports = (
    <Scene key="events" component={events} title="Home" hideNavBar={true}/>
);
