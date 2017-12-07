import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { Router } from "react-native-router-flux";

import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise";
import {createLogger} from "redux-logger";
import FCM, { FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType } from "react-native-fcm";
import { Platform } from "react-native";

import reducer from "./reducers";
import UserApi from "./components/api/users/users";

const RouterWithRedux = connect()(Router);
const logger = createLogger();
const enhancer = compose(
  applyMiddleware(thunk, promise, logger)
);

export const store = createStore(reducer, {}, enhancer);

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
          <RouterWithRedux>
            { require("./app.routes.js")}
          </RouterWithRedux>
      </Provider>
    );
  }
}
