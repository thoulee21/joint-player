import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { useDebounce } from '../hook';
import { Main, Userprofile } from '../types/searchUsers';
import { LottieAnimation } from './LottieAnimation';
import { UserItem } from './UserItem';

export const UserList = ({ searchQuery }: { searchQuery: string }) => {
    const appTheme = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const { data, setSize, error, mutate, isLoading } = useSWRInfinite<Main>((index) =>
        `https://music.163.com/api/search/get/web?s=${searchQuery}&type=1002&offset=${index * 15}&limit=15`,
    );

    const users = useMemo(() => {
        if (data && data?.[0].code === 200) {
            return data?.map((item) => item.result.userprofiles).flat();
        } else if (data) {
            // if there is an api error
            ToastAndroid.show(
                `Error: ${data?.[0].code} ${data?.[0].message}`,
                ToastAndroid.SHORT
            );
        }

        return [];
    }, [data]);

    const hasMore = useMemo(() =>
        data && data[0].result && users.length !== data[0].result.userprofileCount,
        [data, users]
    );

    const refresh = async () => {
        setRefreshing(true);
        await mutate();
        setRefreshing(false);
    };

    const loadMore = useDebounce(() => {
        if (hasMore) { setSize(prev => prev + 1); }
    }, 1000);

    const renderItem = useCallback(({ item }: { item: Userprofile }) => (
        <UserItem item={item} />
    ), []);

    if (isLoading) {
        return <ActivityIndicator size="large" style={styles.loading} />;
    }

    if (error) {
        return (
            <>
                <List.Item
                    title={error.message}
                    titleStyle={{ color: appTheme.colors.error }}
                    left={(props) => (
                        <List.Icon {...props}
                            icon="alert-circle-outline"
                            color={appTheme.colors.error}
                        />
                    )}
                />
                <LottieAnimation
                    style={{
                        height: Dimensions.get('window').height / 1.5,
                        width: Dimensions.get('window').width
                    }}
                    animation="breathe"
                    caption="Try to search later or with another query"
                />
            </>
        );
    }

    return (
        <FlatList
            data={users}
            renderItem={renderItem}
            initialNumToRender={7}
            onEndReachedThreshold={0.1}
            onEndReached={loadMore}
            onRefresh={refresh}
            refreshing={refreshing}
            ListFooterComponent={
                hasMore && users.length
                    ? <ActivityIndicator
                        style={styles.footerLoading}
                    /> : null}
            ListEmptyComponent={
                <LottieAnimation
                    style={{
                        height: Dimensions.get('window').height / 1.2,
                        width: Dimensions.get('window').width
                    }}
                    animation="breathe"
                    caption={
                        `No users found\n${data?.[0].message
                        || 'Try another search query later'}`
                    }
                />
            }
        />
    );
};

const styles = StyleSheet.create({
    footerLoading: {
        marginVertical: '5%'
    },
    loading: {
        marginTop: '20%'
    }
});
