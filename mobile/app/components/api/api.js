import { Actions } from "react-native-router-flux";
import { AsyncStorage } from "react-native";
/*eslint no-console: ["error", { allow: ["log"] }] */
// For android emulator, replace by your IP if running on device.
export const apiRouteBase = "https://aicom.herokuapp.com";
// export const apiRouteBase = "http://10.42.0.1:8080";
// export const apiRouteBase = "http://192.168.43.67:8080";
// export const apiRouteBase = "http://10.0.2.2:8080";
// export const apiRouteBase = "http://192.168.0.13:8080";

export default (() => {
  // Vars
  this.token = null;
  this.locationHeader = null;
  this.location = null;

  // Functions
  this.headers = () => {
    let headers = new Headers();
    headers.append("X-Token", this.token);
    if (this.locationHeader) {
      headers.append("X-Location", this.locationHeader);
      console.log("location header", this.locationHeader);
    }
    console.log("set location", this.locationHeader);
    headers.append("Content-Type", "application/json");
    return headers;
  };

  this.setToken = (token) => (this.token = token);

  this.setLocation = (locationHeader) => {
    this.locationHeader = `[${locationHeader.coords.longitude}, ${locationHeader.coords.latitude}]`;
    this.location = locationHeader.coords;
  };

  this.auth = (params) => {
    if (!this.token) {
      Actions.login();
      return new Promise((resolve,reject) => reject("not authentified"));
    }
    return this.request(params);
  };

  this.request = ({ url, opts , method = "GET", data, cache }) => {
    var promise = Promise.resolve(null);
    opts = opts || {};
    opts.headers = this.headers();
    opts.method = method || "GET";
    if (method && method !== "GET" && data) {
      opts.body = JSON.stringify(data);
    }
    if (cache) {
      if (method === "GET") {
        console.log("API get cache ?", url);
        promise = cache.get(url).then((e) => e, () => null);
      } else {
        console.log("API reset cache ?", url);
        promise = cache.reset();
      }
    }
    let path = `${apiRouteBase}${url}`;
    console.log("API auth request",url, method, path, opts, cache);

    return promise.then(resp => {
      console.log("API cache response ?", resp, url);
      return resp ||
      fetch(path, opts).then((response) => {
      console.log("API fetch response", response, url);
      if (response.status === 401) {
        console.log("auth failed, go to login");
        AsyncStorage.removeItem("login");
        Actions.login();
        throw "Authentication required";
      }
      if (response.status < 200 || response.status > 299) {
        throw response.text();
      }
      return response.text();
    });}).then((result) => {
      if (result) {
        if (cache && !result.fromCache) {
          cache.set(url, result);
        }
        return JSON.parse(result);
      }
      return result;
    });
  };

  return this;
})();
