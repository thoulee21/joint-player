import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, ToastAndroid } from "react-native";
import HapticFeedback from "react-native-haptic-feedback";
import { Appbar, Avatar, Divider, List, useTheme } from 'react-native-paper';
import { useActiveTrack } from "react-native-track-player";
import { requestInit } from "../services";
import { Comment, Main } from '../types/comments';

function CommentList() {
    const appTheme = useTheme();
    const track = useActiveTrack();
    const [comments, setComments] = useState<Comment[]>([]);

    const id = track?.id;
    const limit = 30;
    const offset = 1;

    useEffect(() => {
        const fetchComments = async () => {
            const response = await fetch(
                `http://music.163.com/api/v1/resource/comments/R_SO_4_${id}?limit=${limit}&offset=${offset}`,
                requestInit
            );

            const data: Main = await response.json();
            setComments(data.comments);
        };

        fetchComments();
    }, [id]);

    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item.commentId.toString()}
            renderItem={({ item }) =>
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
            }
            ItemSeparatorComponent={() => <Divider />}
            ListEmptyComponent={() => <List.Item title="No comments" />}
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
});