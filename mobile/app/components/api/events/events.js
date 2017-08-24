import api from "../api";
import ApiCache from "../../apiCache/apiCache";


let cache = new ApiCache("events", 60 * 3);
export let EventCache = cache;
let defaultParams = { cache : cache };

export default {
  list : (params = defaultParams) => api.auth({ ...params, url : "/event" }),
  create : (event, params = defaultParams) => api.auth({ ...params, url : "/event", data : event, method : "POST" }),
  accept : (id, params = defaultParams) => api.auth({ ...params, url : `/event/${id}` , method : "PUT" }),
  getPending : (params = defaultParams) => api.auth({ ...params, url : "/event/pending" }),
};
