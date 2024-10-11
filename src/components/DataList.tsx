import React, { useCallback } from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { DataItem, DataItemType } from './DataItem';

export const DataList = ({ dataItems }: {
    dataItems: DataItemType[]
}) => {
    const renderItem = useCallback(({ item }: {
        item: DataItemType
    }) => (
        <DataItem item={item} />
    ), []);

    const keyExtractor = useCallback((item: DataItemType) => item.name, []);

    return (
        <FlatList
            data={dataItems}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListFooterComponent={
                <View style={styles.androidView} />
            }
            ListEmptyComponent={
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    androidView: {
        height: Platform.OS === 'android' ? 20 : 0,
    },
    loading: {
        marginTop: Dimensions.get('window').height / 2 - 100,
    },
});
