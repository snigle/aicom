import api from "../api";

export default {
  list : () => api.auth("/event"),
  create : (event) => api.auth("/event", event, { method : "POST" }),
  getPending : () => api.auth("/event/pending"),
};
