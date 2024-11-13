import { storage as mmkvStorage, reduxStorage } from './reduxPersistMMKV';

export class Storage {
  //直接传js值，不必转换字符串
  static set(key: string, value: any) {
    return reduxStorage.setItem(key, JSON.stringify(value));
  }

  //拿到的就是js值，不必转换
  static async get(key: string) {
    try {
      const value = await reduxStorage.getItem(key);
      if (value && value !== '') {
        return JSON.parse(value);
      }
      return null;
    } catch {
      return null;
    }
  }

  static remove(key: string) {
    return reduxStorage.removeItem(key);
  }

  static clear() {
    return mmkvStorage.clearAll();
  }
}
