import React from 'react';
import { StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Button, Caption, List, useTheme } from 'react-native-paper';

export const TracksHeader = ({ onPress, length }: {
    onPress: () => void; length: number;
}) => {
    const appTheme = useTheme();
    return (
        <View
            style={[styles.songsHeader, {
                backgroundColor: appTheme.colors.surface,
                borderTopLeftRadius: appTheme.roundness * 5,
                borderTopRightRadius: appTheme.roundness * 5,
            }]}
        >
            <Button
                compact
                icon="play-circle"
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    onPress();
                }}
            >
                Play All
            </Button>
            <List.Subheader>
                <Caption>
                    {length} song(s)
                </Caption>
            </List.Subheader>
        </View>
    );
};

const styles = StyleSheet.create({
    songsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '2%',
        marginTop: '2%',
    },
});
