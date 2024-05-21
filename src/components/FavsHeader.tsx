import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, List } from 'react-native-paper';

export const FavsHeader = ({ onPress, length }: {
    onPress: () => void; length: number;
}) => {
    return (
        <View style={styles.songsHeader}>
            <Button
                icon="play-circle-outline"
                onPress={onPress}
            >
                Play All
            </Button>
            <List.Subheader>
                {length} song(s)
            </List.Subheader>
        </View>
    );
};

const styles = StyleSheet.create({
    songsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '2%'
    },
});
