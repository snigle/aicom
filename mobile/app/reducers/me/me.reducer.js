// @flow weak
import { SET_ME, ADD_ACTIVITY, REMOVE_ACTIVITY } from "./me.actions";

// Reducer
const DEFAULT_STATE = null;


export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case SET_ME:
      return { ...action.me };
    case ADD_ACTIVITY:
      var stateCopy = { ...state };
      stateCopy.activities[action.activity] = true;
      return stateCopy;
    case REMOVE_ACTIVITY:
      var stateCopy = { ...state };
      stateCopy.activities[action.activity] = false;
      return stateCopy;
    default:
      return state;
  }
}
