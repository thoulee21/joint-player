import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React from "react";
import { StatusBar } from "react-native";
import {
    Avatar,
    Card,
    TouchableRipple,
    useTheme
} from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { TrackMenu } from "./TrackMenu";

const placeholderImg = 'https://picsum.photos/100';

export const TrackInfoBar = () => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const track = useActiveTrack();

    return (
        <BlurView
            style={{ paddingTop: StatusBar.currentHeight }}
            tint={appTheme.dark ? 'dark' : 'light'}
        >
            <Card.Title
                title={track?.title}
                subtitle={track?.artist}
                subtitleStyle={{ color: appTheme.colors.primary }}
                left={(props) =>
                    <TouchableRipple
                        {...props}
                        onPress={() => {
                            // @ts-ignore
                            navigation.push('Player');
                        }}
                    >
                        <Avatar.Image
                            {...props}
                            source={{ uri: track?.artwork || placeholderImg }}
                        />
                    </TouchableRipple>
                }
                right={() => <TrackMenu />}
            />
        </BlurView>
    )
}