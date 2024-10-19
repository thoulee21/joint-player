import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Text } from 'react-native-paper';

export const AlbumDescription = ({ description }: { description?: string }) => {
    const [showFullDesc, setShowFullDesc] = useState(false);

    if (!description) {
        return null;
    }

    return (
        <ScrollView
            fadingEdgeLength={100}
            showsVerticalScrollIndicator={showFullDesc}
        >
            <Text
                style={styles.description}
                numberOfLines={showFullDesc ? undefined : 5}
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    setShowFullDesc(!showFullDesc);
                }}
            >
                {description}
            </Text>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    description: {
        marginHorizontal: '6%',
    },
});
