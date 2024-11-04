import AsyncStorage from '@react-native-async-storage/async-storage';

export class Storage {
  //直接传js值，不必转换字符串
  static set(key: string, value: any) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  //拿到的就是js值，不必转换
  static async get(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value && value !== '') {
        return JSON.parse(value);
      }
      return null;
    } catch {
      return null;
    }
  }

  static update(key: string, value: string | object) {
    return AsyncStorage.mergeItem(key, JSON.stringify(value));
  }

  static remove(key: string) {
    return AsyncStorage.removeItem(key);
  }

  static clear() {
    return AsyncStorage.clear();
  }
}
