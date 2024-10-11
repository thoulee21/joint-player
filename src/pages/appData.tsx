import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Divider } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { DataItemType } from '../components/DataItem';
import { DataList } from '../components/DataList';
import { store } from '../redux/store';
import { Storage } from '../utils';
import { StorageKeys } from '../utils/storageKeys';

const TopTab = createMaterialTopTabNavigator();

export function AppDataScreen() {
    const navigation = useNavigation();

    return (
        <BlurBackground>
            <Appbar.Header style={styles.transparent}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="App Data" />
            </Appbar.Header>

            <TopTab.Navigator
                backBehavior="none"
                screenOptions={{
                    lazy: true,
                    tabBarStyle: [
                        styles.tabBar,
                        styles.transparent
                    ],
                    tabBarAndroidRipple: {
                        color: 'transparent',
                        borderless: true,
                    }
                }}
                sceneContainerStyle={styles.transparent}
            >
                <TopTab.Screen
                    name="ReduxState"
                    component={ReduxState}
                    options={{ title: 'Redux State' }}
                />
                <TopTab.Screen
                    name="StorageList"
                    component={StorageList}
                    options={{ title: 'Local Storage' }}
                />
            </TopTab.Navigator>
        </BlurBackground>
    );
}

export function ReduxState() {
    const state: { [key: string]: any } = store.getState();
    const stateList = Object.keys(state).map((key) => ({
        name: key,
        data: state[key].value || state[key],
    }));

    return (
        <>
            <Divider />
            <DataList dataItems={stateList} />
        </>
    );
}

export function StorageList() {
    const [localData, setLocalData] = useState<DataItemType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const storageFetches = Object.values(StorageKeys)
                .map(async (localDataName) => {
                    const data = await Storage.get(localDataName);
                    return {
                        name: localDataName,
                        data: data,
                    };
                });
            const dataItems = await Promise.all(storageFetches);
            setLocalData(dataItems);
        };

        fetchData();
    }, []);

    return (
        <>
            <Divider />
            <DataList dataItems={localData} />
        </>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        shadowColor: 'transparent',
    },
    transparent: {
        backgroundColor: 'transparent',
    },
});
