import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
    ActivityIndicator,
    Button,
    Portal,
    Text
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import {
    BlurBackground,
    CommentList,
    DialogWithRadioBtns,
    MvCover,
    MvInfoButtons,
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
    const [dialogVisible, setDialogVisible] = useState(false);
    const [res, setRes] = useState<string | null>(null);

    const track = useActiveTrack();
    const { data, isLoading } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    const [btns, highestRes] = useMemo(() => {
        if (!isLoading && track?.mvid !== 0) {
            const mvData = data?.data.brs || { '240': '' };

            return [
                Object.keys(mvData)
                    .map((value) => ({
                        key: value,
                        value: data?.data.brs[value] as string
                    })),
                Object.keys(mvData).reverse()[0]
            ];
        } else {
            return [
                [{ key: '240', value: '' }],
                '240'
            ];
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
                                <Button {...props}
                                    icon="video-switch-outline"
                                    onPress={() => {
                                        setDialogVisible(true);
                                    }}
                                >
                                    {res || highestRes}p
                                </Button>
                            }
                        />
                        <MvInfoButtons res={res} />
                    </MvCover>

                    <CommentList commentThreadId={`R_MV_5_${track?.mvid}`} />
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
