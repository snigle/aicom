import api from "../api";

export default {
  me : () => (api.auth("/user/me")),
  list : () => (api.auth("/user")),
  addActivity : (activity) => (api.auth(`/user/activity?name=${activity}`, null, { method : "PUT" })),
  setNotificationToken : (token) => (api.auth("/user/notification", { "token" : token }, { method : "PUT" })),
  removeActivity : (activity) => (api.auth(`/user/activity?name=${activity}`, null, { method : "DELETE" })),
};
