import React from "react";

import { Scene } from "react-native-router-flux";

module.exports = (
  <Scene key="app">

    {require("./activities/login/login.route")}
    {require("./activities/events/events.route")}
    {require("./activities/event/event.route")}
    {require("./activities/message/message.route")}
    {require("./activities/settings/settings.route")}
    {require("./activities/profile/profile.route")}
</Scene>
);
