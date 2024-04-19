import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback
} from "react-native";
import HapticFeedback from "react-native-haptic-feedback";
import { Avatar, Card, useTheme } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { TrackMenu } from ".";

const placeholderImg = 'https://picsum.photos/100';

export const TrackInfoBar = () => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const track = useActiveTrack();

    return (
        <Card.Title
            title={track?.title}
            subtitle={track?.artist}
            subtitleStyle={{ color: appTheme.colors.primary }}
            style={[
                styles.infoBar,
                { paddingTop: StatusBar.currentHeight }
            ]}
            left={({ size }) =>
                <TouchableWithoutFeedback
                    onPress={() => {
                        HapticFeedback.trigger("effectHeavyClick");
                        navigation.goBack();
                    }}
                >
                    <Avatar.Image
                        size={size}
                        source={{ uri: track?.artwork || placeholderImg }}
                    />
                </TouchableWithoutFeedback>
            }
            right={TrackMenu}
        />
    )
}

const styles = StyleSheet.create({
    infoBar: {
        marginVertical: "5%",
    },
})