import React, { useMemo } from 'react';
import packageJson from '../../package.json';
import { store } from '../redux/store';
import { storage } from '../utils/reduxPersistMMKV';
import { DataList } from './DataList';

export const PackageData = () => {
  const packageData = useMemo(() => (
    Object.keys(packageJson).map((
      key
    ) => ({
      name: key,
      data: (packageJson as Record<string, any>)[key],
    }))
  ), []);

  return <DataList dataItems={packageData} />;
};

export const ReduxState = () => {
  const state: { [key: string]: any } = store.getState();

  const stateList = useMemo(() => (
    Object.keys(state).map((
      key
    ) => ({
      name: key,
      data: state[key].value || state[key],
    }))
  ), [state]);

  return <DataList dataItems={stateList} />;
};

export const StorageList = () => {
  const dataItems = useMemo(() => (
    storage.getAllKeys().map((
      localDataName
    ) => ({
      name: localDataName,
      data: JSON.parse(
        storage.getString(localDataName) || ''
      ),
    }))
  ), []);

  return <DataList dataItems={dataItems} />;
};
