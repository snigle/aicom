import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { Router } from "react-native-router-flux";

import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise";
import createLogger from "redux-logger";

import reducer from "./reducers";

const RouterWithRedux = connect()(Router);
const logger = createLogger();
const enhancer = compose(
  applyMiddleware(thunk, promise, logger)
);

const store = createStore(reducer, {}, enhancer);

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
