import { AsyncStorage } from "react-native";
import _ from "lodash";
import moment from "moment";

export default class ApiCache {
  constructor(prefix, delay = 3600) {
    console.log("cache constructor", prefix, delay);
    this.prefix = prefix;
    this.delay = delay;
  }

  _addPrefix(key) {
    return `${this.key}$$${key}`;
  }

  reset() {
    let self = this;
    return this._getKeys().then((keys) => {
      console.log("reset cache", keys);
      return Promise.all(_.mapKeys(keys), key => {
        return AsyncStorage.removeItem(self._addPrefix(key));
      }).then(() => AsyncStorage.removeItem(self._addPrefix("cache_keys")));
    }).catch((err) => console.log("fail to reset cache", err));
  }

  set(key, data) {
    let self = this;
    return this._getKeys().then((keys) => {
      console.log("set cache", key, keys, keys[key]);
      keys[key] = moment();
      self._saveKeys(keys);
      return AsyncStorage.setItem(this._addPrefix(key), data);
    });
  }

  _getKeys() {
    return AsyncStorage.getItem(this._addPrefix("cache_keys")).then((keys) => {
      if (keys) {
        return _.mapValues(JSON.parse(keys), (value) => moment(value));
      }
      return {};
    }, () => { return {}; });
  }

  _saveKeys(keys) {
    console.log("save keys", keys);
    if (keys) {
      return this._getKeys().then((cachedKeys) =>
        AsyncStorage.setItem(this._addPrefix("cache_keys"), JSON.stringify({ ...cachedKeys, ...keys }))
      );
    }
    return Promise.resolve(null);
  }

  get(key) {
    return this._getKeys().then((keys) => {
      console.log("read cache", key, keys[key], this.delay, keys[key] && keys[key].clone().add(this.delay, "s").isBefore(moment()));
      if (!keys[key] || keys[key].clone().add(this.delay, "s").isBefore(moment())) {
        return Promise.resolve(null);
      }
      return AsyncStorage.getItem(this._addPrefix(key)).then((resp) => {
        console.log("read cache successful");
        return resp;
      });
    });
  }

}
