import React from "react";

import { Scene } from "react-native-router-flux";

module.exports = (
  <Scene key="app">
    {require("./activities/account/account.route")}
    {require("./activities/login/login.route")}
    {require("./activities/settings/settings.route")}
    {require("./activities/events/events.route")}

  </Scene>
);
