import React from 'react';
import { StyleSheet, View } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Chip } from 'react-native-paper';

export const CHIPS = ['Albums'];

export const Chips = () => {
    return (
        <View style={styles.chips}>
            {CHIPS.map((chip, index) => (
                <Chip
                    key={chip}
                    style={styles.chip}
                    selected={!index}
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.effectHeavyClick
                        );
                        //TODO
                    }}
                >
                    {chip}
                </Chip>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    chips: {
        flexDirection: 'row',
        width: '100%',
    },
    chip: {
        marginLeft: '3%',
        marginVertical: '1%',
        width: 'auto',
    },
});
