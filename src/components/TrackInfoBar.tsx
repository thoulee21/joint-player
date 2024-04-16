import React from "react";
import { StatusBar } from "react-native";
import { Avatar, Card, useTheme } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { TrackMenu } from ".";

export const TrackInfoBar = () => {
    const placeholderImg = 'https://picsum.photos/100';

    const track = useActiveTrack();
    const appTheme = useTheme();

    return (
        <Card style={{ paddingTop: StatusBar.currentHeight }}>
            <Card.Title
                title={track?.title}
                subtitle={track?.artist}
                subtitleStyle={{ color: appTheme.colors.primary }}
                left={(props) =>
                    <Avatar.Image
                        {...props}
                        source={{ uri: track?.artwork || placeholderImg }}
                    />
                }
                right={() => <TrackMenu />}
            />
        </Card>
    )
}