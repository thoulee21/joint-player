import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { CommentList } from '../components/CommentList';

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    const { commentThreadId } = useRoute().params as { commentThreadId: string };

    return (
        <BlurBackground>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Comments" />
            </Appbar.Header>

            <CommentList commentThreadId={commentThreadId} />
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
    },
});
