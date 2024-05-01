import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { ActivityIndicator, Portal, Text } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import {
    BlurBackground,
    CommentList,
    DialogWithRadioBtns,
    MvArgsMenu,
    MvCover,
    MvInfoButtons,
    TrackInfoBar
} from '../components';
import { Main as MvMain } from '../types/mv';

const CommentsView = () => {
    const track = useActiveTrack();
    const { data } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );
    return (
        <CommentList
            commentThreadId={data?.data.commentThreadId as string}
        />
    );
};

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
    const [dialogVisible, setDialogVisible] = useState(false);
    const [res, setRes] = useState<string | null>(null);

    const track = useActiveTrack();
    const { data, isLoading } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    const btns = useMemo(() => {
        if (!isLoading && track?.mvid !== 0) {
            return Object.keys(data?.data.brs || { '240': '' })
                .map((value) => ({
                    key: value,
                    value: data?.data.brs[value] as string
                }));
        } else {
            return [{ key: '240', value: '' }];
        }
    }, [data, isLoading, track?.mvid]);

    if (isLoading) {
        return (
            <ActivityIndicator
                size="large"
                style={styles.loading}
            />
        );
    }

    return (
        <BlurBackground>
            {track?.mvid !== 0
                ? <>
                    <MvCover>
                        <TrackInfoBar
                            right={(props) =>
                                <MvArgsMenu {...props}
                                    setDialogVisible={setDialogVisible}
                                />
                            }
                        />
                        <MvInfoButtons res={res} />
                    </MvCover>

                    <CommentsView />
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
});
