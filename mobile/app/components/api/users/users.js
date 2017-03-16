import api from "../api";

export default {
  me : () => (api.auth("/user/me")),
  list : () => (api.auth("/user")),
  addActivity : (activity) => (api.auth(`/user/activityTOTO?name=${activity}`, null, { method : "PUT" })),
  removeActivity : (activity) => (api.auth(`/user/activity?name=${activity}`, null, { method : "DELETE" })),
};
