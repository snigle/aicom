import api from "../api";
import { EventCache } from "../events/events";

let defaultParams = { cache : EventCache };

export default {
  me : (params = defaultParams) => api.auth({ ...params, url : "/user/me" }),
  list : (params = defaultParams) => api.auth({ ...params, url : "/user" }),
  addActivity : (activity, params = defaultParams) => api.auth({ ...params, url : `/user/activity?name=${activity}`, method : "PUT" }),
  // No cache for this call to avoid to many refresh
  setNotificationToken : (token, params = {}) => api.auth({ url : "/user/notification", data : { "token" : token }, method : "PUT" }),
  removeActivity : (activity, params = defaultParams) => api.auth({ ...params, url : `/user/activity?name=${activity}`, method : "DELETE" }),
};
