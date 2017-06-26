import api from "../api";

export default {
  list : () => api.auth("/event"),
  create : (event) => api.auth("/event", event, { method : "POST" }),
  accept : (id) => api.auth("/event/" + id, null, { method : "PUT" }),
  getPending : () => api.auth("/event/pending"),
};
