// @flow weak
import { ADD_MESSAGE, MARK_AS_RECEIVED } from "./message.actions";
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
      stateCopy = _.uniqBy(stateCopy,"uuid");
      cache.set("state",stateCopy).catch(err => console.log("fail to save message cache", err));
      return stateCopy;
    case MARK_AS_RECEIVED:
      var stateCopy = _.clone(state);
      var message = _.find(stateCopy, { uuid : action.uuid });
      if (message) {
        message.received = true;
      }
      cache.set("state",stateCopy).catch(err => console.log("fail to save message cache", err));
      return stateCopy;
    default:
      return state;
  }
}
