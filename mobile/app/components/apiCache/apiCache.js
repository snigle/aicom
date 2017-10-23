import { AsyncStorage } from "react-native";
import _ from "lodash";
import moment from "moment";

export default class ApiCache {
  constructor(prefix, delay = 3600) {
    let self = this;
    self.prefix = prefix;
    self.delay = delay;
    self.mutex = Promise.resolve();
    self.log("cache constructor", prefix, delay);
  }

  _addPrefix(key) {
    let self = this;
    return `${self.prefix}$$${key}`;
  }

  log(message) {
    console.log("apiCache",this.prefix, message, arguments);
  }

  reset() {
    let self = this;
    self.mutex =  self.mutex.then(() => {
      return self._getKeys().then((keys) => {
        self.log("reset cache", keys);
        return Promise.all(_.mapKeys(keys), key => {
          return AsyncStorage.removeItem(self._addPrefix(key));
        }).then(() => AsyncStorage.removeItem(self._addPrefix("cache_keys")));
      }).catch((err) => self.log("fail to reset cache", err));
    });
    return self.mutex;
  }

  set(key, data) {
    let self = this;
    self.mutex = self.mutex.then(() => {
      return self._getKeys().then((keys) => {
        self.log("set cache", key, keys, keys[key]);
        keys[key] = moment();
        self._saveKeys(keys);
        if (!_.isString(data)) {
          data = JSON.stringify(data);
        }
        return AsyncStorage.setItem(self._addPrefix(key), data);
      });
    });
    return self.mutex;
  }

  _getKeys() {
    let self = this;
    return AsyncStorage.getItem(self._addPrefix("cache_keys")).then((keys) => {
        if (keys) {
          return _.mapValues(JSON.parse(keys), (value) => moment(value));
        }
        return {};
    }, () => { return {}; });
  }

  _saveKeys(keys) {
    let self = this;
    self.log("save keys", keys);
    self.mutex = self.mutex.then(() => {
      if (keys) {
        return self._getKeys().then((cachedKeys) =>
        AsyncStorage.setItem(self._addPrefix("cache_keys"), JSON.stringify({ ...cachedKeys, ...keys })));
      }
      return null;
    });
    return self.mutex;
  }

  get(key) {
    let self = this;
    self.mutex = self.mutex.then(() => self._getKeys().then((keys) => {
      self.log("read cache", key, keys[key], self.delay, keys[key] && keys[key].clone().add(self.delay, "s").isBefore(moment()));
      if (!keys[key] || keys[key].clone().add(self.delay, "s").isBefore(moment())) {
        return Promise.resolve(null);
      }
      return AsyncStorage.getItem(self._addPrefix(key)).then((resp) => {
        self.log("read cache successful");
        resp.fromCache = true;
        return resp;
      });
    }));
    return self.mutex;
  }

}
