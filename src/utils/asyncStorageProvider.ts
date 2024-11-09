import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from 'swr';

class AsyncStorageProvider implements Cache<any> {
  private cache = new Map<string, any>();

  constructor() {
    this.loadCache();
  }

  private async loadCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      stores.forEach(([key, value]) => {
        if (value) {
          this.cache.set(key, JSON.parse(value));
        }
      });
    } catch (error) {
      console.error('Failed to load cache from AsyncStorage', error);
    }
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    this.cache.set(key, value);
    AsyncStorage.setItem(key, JSON.stringify(value));
  }

  delete(key: string) {
    this.cache.delete(key);
    AsyncStorage.removeItem(key);
  }

  *keys(): IterableIterator<string> {
    for (const key of this.cache.keys()) {
      yield key;
    }
  }
}

export const asyncStorageProvider = (): Cache<any> => {
  return new AsyncStorageProvider();
};
