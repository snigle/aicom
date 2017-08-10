import api from "../api";

export default {
  login : (token, params = {}) => api.request({ ...params, url : "/login", method : "POST", data : { token : token } }),
  logout : (token, params = {}) => api.auth({ url : "/logout", method : "DELETE" }),
};
