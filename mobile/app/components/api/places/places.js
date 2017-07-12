import api from "../api";
import { AsyncStorage } from "react-native";

export default {
  list :
    () => AsyncStorage.getItem("/place.v2").then(
      (u) => u && JSON.parse(u) || api.auth("/place"),
      () => api.auth("/place")
    ).then(response => {
      console.log("save /place");
      AsyncStorage.setItem("/place.v2", JSON.stringify(response));
      return response;
    }),
};
