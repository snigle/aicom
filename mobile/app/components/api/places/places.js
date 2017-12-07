import api from "../api";
import ApiCache from "../../apiCache/apiCache";

export let PlaceCache = new ApiCache("place", 60 * 60 * 24 * 30);

export default {
  list : (params) =>  api.auth({ ...params, url : "/place", cache : PlaceCache }),
};
