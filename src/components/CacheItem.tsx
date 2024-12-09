import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ToastAndroid } from 'react-native';
import { List } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';
import { formatDataSize } from '../utils/formatDataSize';
import { initFocus } from '../utils/initFocus';
import { mmkvStorage } from '../utils/mmkvStorageProvider';

export const CacheItem = () => {
  const { t } = useTranslation();

  const [cacheSize, setCacheSize] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    return initFocus(() => {
      setIsLoaded(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      const keys = mmkvStorage.getAllKeys();
      let size = 0;

      keys.forEach((key) => {
        const value = mmkvStorage.getString(key);
        if (value) {
          size += new Blob([value]).size;
        }
      });

      setCacheSize(size);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  const clearCache = useCallback(() => {
    mmkvStorage.clearAll();

    setIsLoaded(false);
    ToastAndroid.show(
      t('settings.data.cache.toast'),
      ToastAndroid.SHORT
    );
  }, [t]);

  const renderCacheIcon = useCallback(
    (props: ListLRProps) => (
      <List.Icon {...props} icon="cached" />
    ), []
  );

  return (
    <List.Item
      title={t('settings.data.cache.title')}
      description={formatDataSize(cacheSize)}
      left={renderCacheIcon}
      onPress={clearCache}
      disabled={cacheSize === 0 || !isLoaded}
    />
  );
};
