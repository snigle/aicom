// @flow weak
import { SET_LOGIN, LOG_OUT } from "./login.actions";

// Reducer
const DEFAULT_STATE = null;


export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case SET_LOGIN:
      // return {...state, action.user};
      return { ...action.user };
    case LOG_OUT:
      return null;
    default:
      return state;
  }
}
