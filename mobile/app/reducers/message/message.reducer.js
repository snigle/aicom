// @flow weak
import { ADD_MESSAGE } from "./message.actions";
import _ from "lodash";
import ApiCache from "../../components/apiCache/apiCache";

// Reducer
export const cache = new ApiCache("message", 60 * 60 * 24);
const DEFAULT_STATE = [];

export default function(state = DEFAULT_STATE, action) {
  switch(action.type) {
    case ADD_MESSAGE:
      var stateCopy = _.clone(state);
      stateCopy.push(action.message);
      cache.set("state",stateCopy).catch(err => console.log("fail to save message cache", err));
      return stateCopy;
    default:
      return state;
  }
}
