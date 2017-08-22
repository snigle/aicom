import { AsyncStorage } from "react-native";
import _ from "lodash";
import moment from "moment";

export default class ApiCache {
  constructor(prefix, delay = 3600) {
    let self = this;
    console.log("cache constructor", prefix, delay);
    self.prefix = prefix;
    self.delay = delay;
    self.mutex = Promise.resolve();
  }

  _addPrefix(key) {
    return `${self.key}$$${key}`;
  }

  reset() {
    let self = this;
    return self.mutex.then(() => {
      let promise = self._getKeys().then((keys) => {
        console.log("reset cache", keys);
        return Promise.all(_.mapKeys(keys), key => {
          return AsyncStorage.removeItem(self._addPrefix(key));
        }).then(() => AsyncStorage.removeItem(self._addPrefix("cache_keys")));
      }).catch((err) => console.log("fail to reset cache", err));
      self.mutex = promise;
      return promise;
    });
  }

  set(key, data) {
    let self = this;
    return self.mutex.then(() => {
      let promise = self._getKeys().then((keys) => {
        console.log("set cache", key, keys, keys[key]);
        keys[key] = moment();
        self._saveKeys(keys);
        return AsyncStorage.setItem(self._addPrefix(key), data);
      });
      self.mutex = promise;
      return promise;
    });
  }

  _getKeys() {
    let self = this;
    return self.mutex.then(() => {
      let promise = AsyncStorage.getItem(self._addPrefix("cache_keys")).then((keys) => {
        if (keys) {
          return _.mapValues(JSON.parse(keys), (value) => moment(value));
        }
        return {};
      }, () => { return {}; });
      self.mutex = promise;
      return promise;
    });
  }

  _saveKeys(keys) {
    console.log("save keys", keys);
    let self = this;
    return self.mutex.then(() => {
      let promise = null;
      if (keys) {
        promise = self._getKeys().then((cachedKeys) =>
        AsyncStorage.setItem(self._addPrefix("cache_keys"), JSON.stringify({ ...cachedKeys, ...keys })));
      }
      self.mutex = promise;
      return promise;
    });
  }

  get(key) {
    let self = this;
    return self.mutex.then(() => {
      let promise =  self._getKeys().then((keys) => {
        console.log("read cache", key, keys[key], self.delay, keys[key] && keys[key].clone().add(self.delay, "s").isBefore(moment()));
        if (!keys[key] || keys[key].clone().add(self.delay, "s").isBefore(moment())) {
          return Promise.resolve(null);
        }
        return AsyncStorage.getItem(self._addPrefix(key)).then((resp) => {
          console.log("read cache successful");
          return resp;
        });
      });
      self.mutex = promise;
      return promise;
    });
  }

}