import api from "../api";
import {AsyncStorage} from "react-native"

export default {
  list : () => AsyncStorage.getItem("/place").then(
    (u) => u && JSON.parse(u) || api.auth("/place"),
    () => api.auth("/place")
  ),
};
