import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, StatusBar, StyleSheet, View } from 'react-native';
import HapticFeedBack, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import {
    ActivityIndicator,
    Button,
    Portal,
    Text,
} from 'react-native-paper';
import TrackPlayer, {
    useActiveTrack
} from 'react-native-track-player';
import useSWR from 'swr';
import {
    BlurBackground,
    CommentList,
    DialogWithRadioBtns,
    MvCover,
    TrackInfoBar
} from '../components';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';
import { Main as MvMain } from '../types/mv';

const NoMV = () => {
    return (
        <>
            <TrackInfoBar style={styles.noMvInfoBar} />
            <Text
                variant="headlineSmall"
                style={styles.noMv}
            >
                No MV for the song
            </Text>
        </>
    );
};

export function MvDetail() {
    const navigator = useNavigation();
    const devModeEnabled = useAppSelector(selectDevModeEnabled);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [res, setRes] = useState<string | null>(null);

    const track = useActiveTrack();
    const { data, isLoading } = useSWR<MvMain>(
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
        navigator.navigate('MvPlayer', { res: res });
    };

    const ResSwitch = (props: any) => (
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
    );

    const printMvData = useCallback(() => {
        if (devModeEnabled && data) {
            if (__DEV__) {
                console.info(JSON.stringify(data.data, null, 2));
            } else {
                Alert.alert(
                    'MV Info',
                    JSON.stringify(data.data, null, 2),
                    [{ text: 'OK' }],
                    { cancelable: true }
                );
            }
        }
    }, [data, devModeEnabled]);

    const BottomBtns = () => {
        return (
            <View style={styles.row}>
                <Button
                    icon={devModeEnabled ? 'heart' : 'heart-outline'}
                    onPress={printMvData}
                >
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

    return (
        <BlurBackground>
            {isLoading
                ? <ActivityIndicator
                    size="large"
                    style={styles.loading}
                />
                : track?.mvid
                    ? <>
                        <MvCover>
                            <TrackInfoBar right={ResSwitch} />
                            <BottomBtns />
                        </MvCover>

                        <CommentList
                            commentThreadId={`R_MV_5_${track?.mvid}`}
                        />
                    </>
                    : <NoMV />}

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
    loading: {
        marginTop: '80%',
    },
    noMv: {
        textAlign: 'center',
        marginTop: '15%'
    },
    noMvInfoBar: {
        marginTop: StatusBar.currentHeight,
        marginVertical: '5%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
    },
});
