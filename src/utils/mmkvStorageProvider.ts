import * as Sentry from "@sentry/react-native";
import { AppState, AppStateStatus, NativeEventEmitter } from "react-native";
import { MMKV } from "react-native-mmkv";
import { Cache } from "swr";
import { rootLog } from "./logger";

const MAX_CACHE_SIZE = 6 * 1024 * 1024; // 6MB

export const mmkvStorage = new MMKV({ id: "app-cache" });

export interface ExtendedCache extends Cache<any> {
  onCacheDeleted(listener: (key: string) => void): void;
  offCacheDeleted(listener: (key: string) => void): void;
}

class MMKVStorageProvider implements ExtendedCache {
  private cache = new Map<string, any>();
  private cacheSize = 0;
  private eventEmitter = new NativeEventEmitter(); // 使用 NativeEventEmitter
  private reloadingKeys = new Set<string>();
  private accessOrder = new Map<string, number>(); // 记录访问顺序
  private listeners = new Map<string, (key: string) => void>(); // 保存监听器引用
  private keysToDelete = new Set<string>(); // 待删除的键列表

  constructor() {
    this.loadCache();
    this.setupAppStateListener();
    this.setupPeriodicSave();
  }

  private async loadCache() {
    try {
      const keys = mmkvStorage.getAllKeys();
      const stores = keys.map((key) => [
        key,
        mmkvStorage.getString(key) as string,
      ]);
      stores.forEach(([key, value]) => {
        if (value) {
          const parsedValue = JSON.parse(value);
          this.cache.set(key, parsedValue);
          this.cacheSize += this.getSizeInBytes(value);
          this.accessOrder.set(key, Date.now()); // 初始化访问时间
        }
      });
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  private getSizeInBytes(value: string): number {
    return new Blob([value]).size;
  }

  private shouldRetainCache(_: string): boolean {
    // 自定义逻辑判断缓存数据是否应该保留
    // 例如，根据数据的使用频率、重要性等
    // 这里简单示例为保留所有用户数据
    // return Object.values(StorageKeys).includes(key as StorageKeys);
    return false;
  }

  private async ensureCacheSize() {
    try {
      while (this.cacheSize > MAX_CACHE_SIZE) {
        rootLog.debug(`Cache size: ${this.cacheSize}`);
        const oldestKey = this.getLeastRecentlyUsedKey();
        if (oldestKey) {
          if (!this.shouldRetainCache(oldestKey)) {
            const value = this.cache.get(oldestKey);
            this.cache.delete(oldestKey);
            this.accessOrder.delete(oldestKey);
            this.cacheSize -= this.getSizeInBytes(JSON.stringify(value));
            mmkvStorage.delete(oldestKey);
            // 在删除缓存数据后触发重新加载数据的逻辑
            this.handleCacheDeletion(oldestKey);
            rootLog.info(`Cache deleted: ${oldestKey}`);
          } else {
            // 如果 oldestKey 应该保存，则跳过删除
            this.cache.delete(oldestKey);
            this.accessOrder.delete(oldestKey);
            rootLog.info(`Cache skipped: ${oldestKey}`);
          }
        }
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  private getLeastRecentlyUsedKey(): string | undefined {
    let oldestKey: string | undefined;
    let oldestAccessTime = Infinity;

    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccessTime) {
        oldestAccessTime = accessTime;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  private handleCacheDeletion(key: string) {
    // 触发重新加载数据的逻辑
    this.reloadingKeys.add(key);
    this.eventEmitter.emit("cacheDeleted", key);
  }

  get(key: string) {
    this.accessOrder.set(key, Date.now()); // 更新访问时间
    return this.cache.get(key);
  }

  async set(key: string, value: any) {
    try {
      if (this.reloadingKeys.has(key)) {
        // 如果数据正在重新加载，则跳过缓存
        this.reloadingKeys.delete(key);
        return;
      }

      const stringValue = JSON.stringify(value);
      const size = this.getSizeInBytes(stringValue);

      if (this.cache.has(key)) {
        const oldValue = this.cache.get(key);
        this.cacheSize -= this.getSizeInBytes(JSON.stringify(oldValue));
      }

      this.cache.set(key, value);
      this.accessOrder.set(key, Date.now()); // 更新访问时间
      this.cacheSize += size;

      // 对关键数据立即写入 MMKV
      if (this.isCriticalKey(key)) {
        mmkvStorage.set(key, stringValue);
      }

      this.ensureCacheSize();
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  delete(key: string) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cacheSize -= this.getSizeInBytes(JSON.stringify(value));
      this.cache.delete(key);
      this.accessOrder.delete(key);
      this.keysToDelete.add(key); // 添加到待删除的键列表
    }
  }

  *keys(): IterableIterator<string> {
    for (const key of this.cache.keys()) {
      yield key;
    }
  }

  onCacheDeleted(listener: (key: string) => void) {
    this.listeners.set(listener.toString(), listener);
    this.eventEmitter.addListener("cacheDeleted", listener);
  }

  offCacheDeleted(listener: (key: string) => void) {
    this.listeners.delete(listener.toString());
    this.eventEmitter.removeAllListeners("cacheDeleted");
    this.listeners.forEach((savedListener) => {
      this.eventEmitter.addListener("cacheDeleted", savedListener);
    });
  }

  private setupAppStateListener() {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === "inactive" || nextAppState === "background") {
        await this.saveCacheToMMKVStorage();
        rootLog.info("Cache saved to MMKV, app is in background");
      }
    };

    AppState.addEventListener("change", handleAppStateChange);
  }

  private setupPeriodicSave() {
    setInterval(() => {
      this.saveCacheToMMKVStorage();
    }, 60000); // 每分钟保存一次
  }

  private async saveCacheToMMKVStorage() {
    try {
      const entries = Array.from(this.cache.entries());
      const multiSetPairs: [string, string][] = entries.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      multiSetPairs.forEach(([key, value]) => {
        mmkvStorage.set(key, value);
      });

      // 批量删除待删除的键
      const keysToDeleteArray = Array.from(this.keysToDelete);
      keysToDeleteArray.forEach((key) => {
        mmkvStorage.delete(key);
      });
      this.keysToDelete.clear();
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  private isCriticalKey(_: string): boolean {
    // 判断是否为关键数据的逻辑
    // 例如，用户数据可以被认为是关键数据
    // return Object.values(StorageKeys).includes(key as StorageKeys);
    return false;
  }
}

export const mmkvStorageProvider = (): ExtendedCache => {
  return new MMKVStorageProvider();
};
