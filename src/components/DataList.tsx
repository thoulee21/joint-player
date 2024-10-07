import React from 'react';
import {
    Dimensions,
    FlatList,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { DataItem, DataItemType } from '.';

export const DataList = ({ dataItems }: {
    dataItems: DataItemType[]
}) => {
    return (
        <FlatList
            data={dataItems}
            renderItem={(props) =>
                <DataItem {...props} />
            }
            ListFooterComponent={
                <View style={styles.androidView} />
            }
            ListEmptyComponent={
                <ActivityIndicator
                    style={styles.loading}
                    size="large"
                />
            }
            keyExtractor={(item) => item.name}
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
