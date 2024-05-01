import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground, Platform, StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Button,
    Card,
    IconButton,
    Menu,
    Portal,
    Surface
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import {
    CommentList,
    DialogWithRadioBtns,
    placeholderImg
} from '../components';
import { useAppSelector } from '../hook/reduxHooks';
import { blurRadius } from '../redux/slices';
import { Main as MvMain } from '../types/mv';

type Brs = { [key: string]: string }

const MvArgsMenu = ({ setDialogVisible, size }:
    {
        setDialogVisible: (visible: boolean) => void;
        size: number;
    }
) => {
    const [visible, setVisible] = useState(false);

    const ChooseRes = () => (
        <Menu.Item
            title="Resolutions"
            leadingIcon="video"
            onPress={() => {
                setVisible(false);
                setDialogVisible(true);
            }}
        />
    );

    return (
        <Menu
            elevation={1}
            visible={visible}
            anchor={
                <IconButton
                    icon="dots-vertical"
                    size={size}
                    onPress={() => setVisible(true)}
                />
            }
            onDismiss={() => setVisible(false)}
        >
            <ChooseRes />
        </Menu>
    );
};

export function MvDetail() {
    const navigator = useNavigation();
    const blurRadiusValue = useAppSelector(blurRadius);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [res, setRes] = useState(null);

    const track = useActiveTrack();
    const { data, isLoading } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

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
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={blurRadiusValue}
        >
            <Appbar.Header style={styles.transparent}>
                <Appbar.BackAction onPress={() => navigator.goBack()} />
                <Appbar.Content title="MV Detail" />
            </Appbar.Header>

            <Card
                mode="contained"
                style={[styles.card, styles.transparent]}
            >
                <Surface elevation={5}>
                    <Card.Cover
                        style={styles.card}
                        source={{
                            uri: data?.data.cover || placeholderImg
                        }}
                    />
                </Surface>
                <Card.Title
                    title={data?.data.name}
                    subtitle={data?.data.artistName}
                    right={(props) =>
                        <MvArgsMenu {...props}
                            setDialogVisible={setDialogVisible}
                        />
                    }
                />

                <Card.Actions>
                    <Button icon="heart-outline">
                        {data?.data.likeCount.toLocaleString()} likes
                    </Button>
                    <Button
                        icon="play-circle-outline"
                        onPress={() => {
                            // @ts-ignore
                            navigator.navigate('MvPlayer', { res: res });
                        }}
                    >
                        {data?.data.playCount.toLocaleString()} plays
                    </Button>
                </Card.Actions>
            </Card>

            <CommentList
                commentThreadId={data?.data.commentThreadId as string}
            />
            <View style={styles.footer} />

            <Portal>
                <DialogWithRadioBtns
                    visible={dialogVisible}
                    close={() => setDialogVisible(false)}
                    btns={Object.keys(data?.data.brs as Brs).map(
                        (value) => ({
                            key: value,
                            value: data?.data.brs[value] as string
                        })
                    )}
                    setValue={setRes as (res: string | null) => void}
                />
            </Portal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 0,
    },
    loading: {
        marginTop: '80%',
    },
    footer: {
        height: Platform.OS === 'android' ? '21%' : 0
    },
    transparent: {
        backgroundColor: 'transparent'
    }
});
