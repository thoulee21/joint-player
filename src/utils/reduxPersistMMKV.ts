import { Storage } from "redux-persist";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "reduxPersist",
});

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};
