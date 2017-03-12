/*eslint no-console: ["error", { allow: ["log"] }] */
// For android emulator, replace by your IP if running on device.
const apiRouteBase = "https://aicom.herokuapp.com";
// const apiRouteBase = "http://10.42.0.1:8080";

export default (() => {
  this.token = null;
  this.headers = () => {
    let headers = new Headers();
    headers.append("X-Token", this.token);
    headers.append("Content-Type", "application/json");
    return headers;
  };
  this.setToken = (token) => (this.token = token);
  this.auth = (url, body, opts = {}) => {
    if (!this.token) {
      return new Promise((resolve,reject) => reject("not authentified"));
    }
    return this.request(url,body,opts);
  };
  this.request = (url, opts = {}, body) => {
    opts.headers = this.headers();
    opts.body = JSON.stringify(body);
    let path = `${apiRouteBase}${url}`;
    console.log("auth request",path,opts);
    return fetch(path, opts).then((response) => {
      console.log("response", response);
      // response.text().then((res) => console.log("response", res));
      return response.json();
    }).then((json) => json, (err) => err);
  };
  return this;
})();
