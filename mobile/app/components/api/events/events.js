import api from "../api";

export default {
  list : () => (api.auth("/events")),
  create : () => (api.auth("/events", { method : "POST" })),
};
