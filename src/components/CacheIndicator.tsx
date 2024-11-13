import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-native-paper';

export const AsyncStorageIndicator = () => {
  const [storageSize, setStorageSize] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const showStorageSize = useMemo(() => (
    (storageSize / 1024 / 1024).toFixed(2)
  ), [storageSize]);

  useEffect(() => {
    const calcStorageSize = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);

      setStorageSize(
        stores.reduce((
          acc, [_, value]
        ) => (
          acc + new Blob([value ?? '']).size
        ), 0)
      );
    };

    if (!isLoaded) {
      calcStorageSize().then(
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
      {storageSize > 0
        ? `${showStorageSize} MB`
        : 'Storage'}
    </Button>
  );
};
