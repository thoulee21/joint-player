import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { BlurBackground, CommentList } from '../components';

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    const track = useActiveTrack();

    return (
        <BlurBackground>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Comments" />
            </Appbar.Header>

            <CommentList commentThreadId={`R_SO_4_${track?.id}`} />
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        display: 'flex',
    },
    header: {
        backgroundColor: 'transparent',
    },
});
