import { NetInfoStateType, useNetInfoInstance } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import HapticFeedBack, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, Appbar, Button, Portal, Text, useTheme } from 'react-native-paper';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { BlurBackground } from '../components/BlurBackground';
import { CommentList } from '../components/CommentList';
import { DialogWithRadioBtns } from '../components/DialogWithRadioBtns';
import { LottieAnimation } from '../components/LottieAnimation';
import { MvCover } from '../components/MvCover';
import { TrackInfoBar } from '../components/TrackInfoBar';
import { Main as MvMain } from '../types/mv';

const MvAppbar = () => {
    const navigation = useNavigation();
    const track = useActiveTrack();

    const { mutate } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    return (
        <Appbar.Header style={styles.header}>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={track?.title} />
            <Appbar.Action
                icon="refresh"
                onPress={() => mutate()}
            />
        </Appbar.Header>
    );
};

const BottomBtns = ({ data, goMvPlayer }: {
    data?: MvMain, goMvPlayer: () => void
}) => {
    return (
        <View style={styles.row}>
            <Button icon="heart-outline">
                {data?.data.likeCount.toLocaleString()}
            </Button>
            <Button
                icon="play-circle"
                onPress={goMvPlayer}
            >
                {data?.data.playCount.toLocaleString()}
            </Button>
        </View>
    );
};

export function MvDetail() {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const { netInfo } = useNetInfoInstance();
    const track = useActiveTrack();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [res, setRes] = useState<string | null>(null);

    const { data, isLoading, error } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    const btns = useMemo(() => {
        if (!isLoading && track?.mvid !== 0) {
            const mvData = data?.data.brs || { '240': '' };
            return Object.keys(mvData);
        } else {
            setDialogVisible(false);
            return ['240'];
        }
    }, [data, isLoading, track?.mvid]);

    const goMvPlayer = () => {
        TrackPlayer.pause();
        // @ts-ignore
        navigation.navigate('MvPlayer', { res: res });

        if (netInfo.type === NetInfoStateType.cellular) {
            ToastAndroid.show(
                'Playing MV on cellular data may consume a lot of data',
                ToastAndroid.LONG
            );
        }
    };

    const ResSwitch = useCallback((props: any) => (
        <Button {...props}
            icon="video-switch-outline"
            onPress={() => {
                HapticFeedBack.trigger(
                    HapticFeedbackTypes.effectHeavyClick
                );
                setDialogVisible(true);
            }}
        >
            {res || btns[btns.length - 1]}P
        </Button>
    ), [btns, res]);

    const renderResSwitch = useCallback((props: any) => (
        <ResSwitch {...props} />
    ), [ResSwitch]);

    if (isLoading) {
        return (<ActivityIndicator size="large" style={styles.loading} />);
    }

    if (error) {
        return (
            <BlurBackground>
                <MvAppbar />
                <LottieAnimation
                    animation="sushi"
                    caption="Try again later"
                >
                    <Text style={[
                        styles.center,
                        { color: appTheme.colors.error }
                    ]}>
                        Error: {error.message}
                    </Text>
                </LottieAnimation>
            </BlurBackground>
        );
    }

    if (!track?.mvid) {
        return (
            <BlurBackground>
                <MvAppbar />
                <LottieAnimation
                    animation="teapot"
                    caption="No MV available"
                />
            </BlurBackground>
        );
    }

    return (
        <BlurBackground>
            <MvCover>
                <TrackInfoBar right={renderResSwitch} />
                <BottomBtns data={data} goMvPlayer={goMvPlayer} />
            </MvCover>
            <CommentList
                commentThreadId={`R_MV_5_${track?.mvid}`}
            />

            <Portal>
                <DialogWithRadioBtns
                    visible={dialogVisible}
                    close={() => setDialogVisible(false)}
                    btns={btns}
                    setValue={setRes as (res: string | null) => void}
                />
            </Portal>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
    },
    loading: {
        marginTop: '80%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
    },
    center: {
        textAlign: 'center',
    }
});
