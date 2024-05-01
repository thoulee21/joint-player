import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useMemo, useState } from 'react';
import {
    ImageBackground,
    Platform,
    StyleSheet,
    View
} from 'react-native';
import {
    ActivityIndicator,
    Portal,
    Text,
    useTheme
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import {
    CommentList,
    DialogWithRadioBtns,
    MvArgsMenu,
    MvCover,
    MvInfoButtons,
    TrackInfoBar,
    placeholderImg
} from '../components';
import { useAppSelector } from '../hook/reduxHooks';
import { blurRadius } from '../redux/slices';
import { Main as MvMain } from '../types/mv';

const NoMV = () => {
    const navigator = useNavigation();
    return (
        <Text
            variant="headlineSmall"
            style={styles.noMv}
            onPress={navigator.goBack}
        >
            {'No MV for the song, \npress to go back'}
        </Text>
    );
};

export function MvDetail() {
    const appTheme = useTheme();
    const blurRadiusValue = useAppSelector(blurRadius);

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
    }, [data?.data.brs, isLoading, track?.mvid]);

    if (isLoading) {
        return (
            <ActivityIndicator
                size="large"
                style={styles.loading}
            />
        );
    }

    return (
        <ImageBackground
            style={styles.root}
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={blurRadiusValue}
        >
            <BlurView
                tint={appTheme.dark ? 'dark' : 'light'}
                style={styles.root}
            >
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

                        <CommentList
                            commentThreadId={data?.data.commentThreadId as string}
                        />
                        <View style={styles.footer} />
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
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: 'flex',
    },
    loading: {
        marginTop: '80%',
    },
    footer: {
        height: Platform.OS === 'android' ? '40%' : 0
    },
    noMv: {
        textAlign: 'center',
        paddingTop: '50%'
    }
});
