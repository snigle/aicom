import { combineReducers } from "redux";

import login from "./login/login.reducer";
import navigation from "./navigation/navigation.reducer";

export default combineReducers({
  login : login,
  navigation : navigation,
});
