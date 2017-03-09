import api from "../api";

export default {
  login : (token) => (api.request("/login", { method : "POST" }, { token : token })),
};
