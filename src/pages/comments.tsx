import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    ToastAndroid
} from "react-native";
import HapticFeedback from "react-native-haptic-feedback";
import {
    ActivityIndicator,
    Appbar,
    Avatar,
    Divider,
    List,
    useTheme
} from 'react-native-paper';
import { useActiveTrack } from "react-native-track-player";
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

    const fetchComments = async () => {
        const response = await fetch(
            `http://music.163.com/api/v1/resource/comments/R_SO_4_${id}?limit=${limit}&offset=${offset}`,
            requestInit
        );
        const data: Main = await response.json();

        setIsEmpty(data.total === 0);
        setComments(data.comments);
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchComments()
            .then(() => {
                setRefreshing(false);
            });
    }

    if (isEmpty) {
        return (
            <List.Item
                title="No comments"
                titleStyle={styles.emptyContent}
            />
        );
    }

    const renderComment = ({ item }: { item: Comment }) =>
        <List.Item
            title={item.user.nickname}
            description={item.content}
            titleStyle={{ color: appTheme.colors.secondary }}
            descriptionNumberOfLines={10}
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
            ItemSeparatorComponent={() => <Divider />}
            // Component to render when loading data
            ListEmptyComponent={() =>
                <ActivityIndicator size="large" style={styles.loading} />
            }
        />
    )
}

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.rootView}>
            <Appbar.Header>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Comments" />
            </Appbar.Header>

            <CommentList />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        display: 'flex',
    },
    emptyContent: {
        alignSelf: 'center',
    },
    loading: {
        marginTop: "20%",
    }
});