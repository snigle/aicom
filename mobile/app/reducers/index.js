import { combineReducers } from "redux";

import login from "./login/login.reducer";
import navigation from "./navigation/navigation.reducer";
import me from "./me/me.reducer";

export default combineReducers({
  login : login,
  navigation : navigation,
  me : me,
});
