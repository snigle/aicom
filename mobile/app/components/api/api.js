/*eslint no-console: ["error", { allow: ["log"] }] */
// For android emulator, replace by your IP if running on device.
const apiRouteBase = "http://10.0.2.2:8080";

export default (() => {
  this.token = null;
  this.headers = () => {
    let headers = new Headers();
    headers.append("X-Auth-Token", this.token);
    return headers;
  };
  this.setToken = (token) => (this.token = token);
  this.auth = (url, body, opts = {}) => {
    if (!this.token) {
      return new Promise((resolve,reject) => reject("not authentified"));
    }
    opts.headers = this.headers();
    opts.body = body;
    console.log("auth request",url,opts);
    return fetch(`${apiRouteBase}/${url}`, opts).then((response) => response.json());
  };
  return this;
})();
