import api from "../api";

export default {
  me : () => (api.auth("/user/me")),
  list : () => (api.auth("/user")),
};
