import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-native-paper';

export const CacheIndicator = () => {
  const [cacheSize, setCacheSize] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const showCacheSize = useMemo(() => (
    (cacheSize / 1024 / 1024).toFixed(2)
  ), [cacheSize]);

  useEffect(() => {
    const calcCacheSize = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);

      setCacheSize(
        stores.reduce((
          acc, [_, value]
        ) => (
          acc + new Blob([value ?? '']).size
        ), 0)
      );
    };

    if (!isLoaded) {
      calcCacheSize().then(
        () => setIsLoaded(true)
      );
    }
  }, [isLoaded]);

  return (
    <Button
      icon="database-search-outline"
      loading={!isLoaded}
      onPress={() => { setIsLoaded(false); }}
    >
      {cacheSize > 0
        ? `${showCacheSize} MB`
        : 'Cache'}
    </Button>
  );
};
