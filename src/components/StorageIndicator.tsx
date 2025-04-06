import React, { useMemo } from "react";
import { Button } from "react-native-paper";
import { formatDataSize } from "../utils/formatDataSize";
import { storage } from "../utils/reduxPersistMMKV";

export const MMKVStorageIndicator = () => {
  const storageSize = useMemo(() => {
    const keys = storage.getAllKeys();
    const stores = keys.map((key) => [key, storage.getString(key)]);

    return stores.reduce(
      (acc, [_, value]) => acc + new Blob([value ?? ""]).size,
      0,
    );
  }, []);

  return (
    <Button icon="database-search-outline">
      {formatDataSize(storageSize)}
    </Button>
  );
};
