import React from "react";

import { Scene } from "react-native-router-flux";
import Settings from "./settings";

module.exports = (
    <Scene key="settings" component={Settings} hideNavBar={true} type="push" animationEnabled={false}/>
);
