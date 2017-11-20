import React from "react";

import { Scene } from "react-native-router-flux";
import { Icon } from "react-native-elements";
import Events from "./events";

module.exports = (
    <Scene key="events" component={Events} hideNavBar={true} type="replace" />
);
