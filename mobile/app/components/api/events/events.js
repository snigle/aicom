import api from "../api";
import ApiCache from "../../apiCache/apiCache";


let cache = new ApiCache("events", 60 * 3);
export let EventCache = cache;
let defaultParams = { cache : cache };

export default {
  list : (params = defaultParams) => api.auth({ ...params, url : "/event" }),
  create : (event, params = defaultParams) => api.auth({ ...params, url : "/event", data : event, method : "POST" }),
  accept : (id, params = defaultParams) => api.auth({ ...params, url : `/event/${id}` , method : "PUT" }),
  cancel : (id, params = defaultParams) => api.auth({ ...params, url : `/event/${id}` , method : "DELETE" }),
  getPending : (params = defaultParams) => api.auth({ ...params, url : "/event/pending" }),
  sendMessage : (id, message, params = {}) => api.auth({ ...params, url : `/event/${id}/message` , method : "POST", data : { message : message } }),
  receivedMessage : (messageId, senderId, params = {}) => api.auth({ ...params, url : `/message/${messageId}` , method : "PUT", data : { uuid : senderId } }),
};
