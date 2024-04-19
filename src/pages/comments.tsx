import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState } from 'react';
import {
    FlatList,
    ImageBackground,
    RefreshControl,
    StyleSheet,
    ToastAndroid
} from "react-native";
import HapticFeedback from "react-native-haptic-feedback";
import {
    ActivityIndicator,
    Appbar,
    Avatar,
    List,
    useTheme
} from 'react-native-paper';
import { useActiveTrack } from "react-native-track-player";
import { PreferencesContext } from '../App';
import { placeholderImg } from '../components';
import { useDebounce } from '../hook';
import { requestInit } from "../services";
import { Comment, Main } from '../types/comments';

function CommentList() {
    const appTheme = useTheme();
    const track = useActiveTrack();

    const [comments, setComments] = useState<Comment[]>([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const id = track?.id;
    const limit = 20;
    const offset = 1;

    const fetchComments = useDebounce(async () => {
        const response = await fetch(
            `http://music.163.com/api/v1/resource/comments/R_SO_4_${id}?limit=${limit}&offset=${offset}`,
            requestInit
        );
        const data: Main = await response.json();

        setIsEmpty(data.total === 0);
        setComments(data.comments);
        setRefreshing(false);
    });

    useEffect(() => {
        fetchComments();
    }, [id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchComments()
    }

    if (isEmpty) {
        return (
            <List.Item
                title="No comments"
                titleStyle={styles.emptyContent}
            />
        );
    }

    const renderComment = ({ item }: { item: Comment }) => (
        <List.Item
            title={item.user.nickname}
            titleStyle={{ color: appTheme.colors.secondary }}
            description={item.content}
            descriptionStyle={{ color: appTheme.colors.onBackground }}
            descriptionNumberOfLines={20}
            left={props =>
                <Avatar.Image {...props}
                    source={{ uri: item.user.avatarUrl }}
                />
            }
            onLongPress={() => {
                Clipboard.setString(item.content);
                HapticFeedback.trigger('effectClick');
                ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
            }}
        />
    )

    return (
        <FlatList
            data={comments}
            refreshing={refreshing}
            onRefresh={onRefresh}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[appTheme.colors.primary]}
                    progressBackgroundColor={appTheme.colors.background}
                />
            }
            keyExtractor={(item) => item.commentId.toString()}
            renderItem={renderComment}
            // Component to render when loading data
            ListEmptyComponent={() =>
                <ActivityIndicator size="large" style={styles.loading} />
            }
        />
    )
}

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    const preferences = useContext(PreferencesContext);
    const appTheme = useTheme();

    const track = useActiveTrack();

    return (
        <ImageBackground
            style={styles.rootView}
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={preferences?.blurRadius}
        >
            <BlurView
                tint={appTheme.dark ? 'dark' : 'light'}
                style={styles.rootView}
            >
                <Appbar.Header style={styles.heder}>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title="Comments" />
                </Appbar.Header>

                <CommentList />
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        display: 'flex',
    },
    heder: {
        backgroundColor: 'transparent',
    },
    emptyContent: {
        alignSelf: 'center',
    },
    loading: {
        marginTop: "20%",
    }
});