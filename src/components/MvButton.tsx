import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { Menu } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { RequestInit } from "../services";

export function MvButton() {
    const track = useActiveTrack();
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (track && track?.mvid) {
            setDisabled(track?.mvid === 0);
        } else {
            setDisabled(true);
        }
    }, [track]);

    return (
        <Menu.Item
            title="Watch MV"
            leadingIcon="video-outline"
            disabled={disabled}
            onPress={async () => {
                const mvData = await fetch(
                    `https://music.163.com/api/mv/detail?id=${track?.mvid}&type=mp4`,
                    RequestInit,
                );
                const mvDetail = await mvData.json();

                const highRes = Object.keys(mvDetail.data.brs).reverse()[0];
                const mv = mvDetail.data.brs[highRes];

                Linking.openURL(mv as string)
            }}
        />
    );
}