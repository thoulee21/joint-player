import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import HapticFeedBack, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import {
    ActivityIndicator,
    Button,
    Portal,
    Text
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
import { Main as MvMain } from '../types/mv';

const NoMV = () => {
    const navigator = useNavigation();
    return (
        <>
            <TrackInfoBar style={styles.noMvInfoBar} />
            <Text
                variant="headlineSmall"
                style={styles.noMv}
                onPress={navigator.goBack}
            >
                {'No MV for the song, \npress to go back'}
            </Text>
        </>
    );
};

export function MvDetail() {
    const navigator = useNavigation();
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

    const ActionBtns = () => (
        <View style={styles.row}>
            <Button
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
            <Button
                icon="play-circle"
                onPress={() => {
                    TrackPlayer.pause();
                    // @ts-ignore
                    navigator.navigate('MvPlayer', { res: res });
                }}
            >
                {data?.data.playCount.toLocaleString()} plays
            </Button>
        </View>
    );

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
                            <ActionBtns />
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
        paddingTop: '15%'
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