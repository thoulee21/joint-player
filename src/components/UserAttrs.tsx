import React, { useMemo } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Text, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import { useAppSelector } from '../hook/reduxHooks';
import { selectUser } from '../redux/slices/user';
import type { Main } from '../types/userDetail';
import { toReadableDate } from '../utils/toReadableDate';

export const UserAttrs = () => {
    const appTheme = useTheme();
    const user = useAppSelector(selectUser);

    const { data, error, isLoading, isValidating } = useSWR<Main>(
        `https://music.163.com/api/v1/user/detail/${user.id}`
    );

    const unlimited = useMemo(() => (
        data?.profile.privacyItemUnlimit
    ), [data]);

    if (isLoading || isValidating) {
        return (
            <ActivityIndicator
                size="large"
                style={styles.loading}
            />
        );
    }

    if (error) {
        return (
            <Text style={[
                styles.errTxt,
                { color: appTheme.colors.error }
            ]}>
                Error: {error.message}
            </Text>
        );
    }

    return (
        <View style={styles.attrRow}>
            {unlimited?.gender && (
                <Chip icon="account" compact style={styles.attr} key="gender">
                    {data?.profile.gender === 1 ? 'Male' : 'Female'}
                </Chip>
            )}
            {unlimited?.age && (
                <Chip icon="cake-variant" compact style={styles.attr} key="birthday">
                    {toReadableDate(data?.profile.birthday || 0)}
                </Chip>
            )}
            {data?.bindings
                .filter(b => b.type === 1)
                .map((b) => (
                    <Chip icon="phone"
                        compact
                        style={styles.attr}
                        key="phoneNumber"
                        onPress={() => {
                            Linking.openURL(`tel:${b.id}`);
                        }}
                    >
                        {b.id}
                    </Chip>
                ))}

            <Chip icon="star" compact style={styles.attr} key="level">
                {data?.level} level
            </Chip>
            <Chip icon="account-multiple-outline" compact style={styles.attr} key="follows">
                {data?.profile.follows} follows
            </Chip>
            <Chip icon="account-multiple" compact style={styles.attr} key="followeds">
                {data?.profile.followeds} followeds
            </Chip>

            <Chip icon="calendar" compact style={styles.attr} key="villageAge">
                {Math.floor((data?.createDays || 0) / 365)} years
            </Chip>
            <Chip icon="timer-outline" compact style={styles.attr} key="timeSpentOnMusic">
                {data?.listenSongs.toLocaleString()} hours
            </Chip>
        </View>
    );
};

const styles = StyleSheet.create({
    attr: {
        margin: '0.5%',
    },
    attrRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    loading: {
        marginTop: '7%',
    },
    errTxt: {
        textAlign: 'center',
        alignSelf: 'center',
        marginTop: '25%',
    }
});
