import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { BlurBackground, CommentList } from '../components';

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    const { commentThreadId } = useRoute().params as { commentThreadId: string };

    const [large, setLarge] = useState(false);

    return (
        <BlurBackground>
            <Appbar.Header style={styles.header} mode={large ? 'large' : 'small'}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Comments" />
                <Appbar.Action
                    icon={large ? 'chevron-up' : 'chevron-down'}
                    onPress={() => setLarge(prev => !prev)}
                />
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
