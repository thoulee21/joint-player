import React, { useCallback, useMemo } from 'react';
import { Button } from 'react-native-paper';
import { storage } from '../utils/reduxPersistMMKV';

export const MMKVStorageIndicator = () => {
  const showStorageSize = useCallback(
    (size: number) => (
      (size / 1024 / 1024).toFixed(2)
    ), []
  );

  const calcStorageSize = useMemo(() => {
    const keys = storage.getAllKeys();
    const stores = keys.map((key) => (
      [key, storage.getString(key)]
    ));

    return (
      stores.reduce((
        acc, [_, value]
      ) => (
        acc + new Blob([value ?? '']).size
      ), 0)
    );
  }, []);

  return (
    <Button icon="database-search-outline">
      {calcStorageSize
        ? `${showStorageSize(calcStorageSize)} MB`
        : 'Storage'}
    </Button>
  );
};
