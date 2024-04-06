import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useEffect, useState } from 'react';
import { Divider, List, useTheme } from "react-native-paper";
import TrackPlayer, { Track, useActiveTrack } from 'react-native-track-player';
import { BottomSheetPaper } from ".";
import playlistData from "../assets/data/playlist.json";

function TrackList() {
    const appTheme = useTheme();
    const currentTrack = useActiveTrack();
    const [queue, setQueue] = useState<Track[]>([]);

    useEffect(() => {
        async function getQueue() {
            const queue = await TrackPlayer.getQueue();
            if (queue) {
                setQueue(queue);
            }
        }

        getQueue().finally(() => {
            // console.log(JSON.stringify(queue));
        });
    }, []);

    return (
        <BottomSheetFlatList
            style={{ height: '100%' }}
            data={queue.length != 0 ? queue : playlistData as Track[]}
            renderItem={({ item, index }) => (
                <List.Item
                    title={item.title}
                    description={item.artist}
                    descriptionStyle={{
                        color: appTheme.colors.secondary,
                    }}
                    style={{
                        backgroundColor:
                            currentTrack?.title === item.title
                                ? appTheme.colors.secondaryContainer
                                : undefined,
                    }}
                    left={(props) => <List.Icon {...props} icon="music-note" />}
                    onPress={async () => {
                        await TrackPlayer.skip(index);
                    }}
                />
            )}
            ItemSeparatorComponent={() => <Divider />}
        />
    );
}

export function TrackListSheet({ bottomSheetRef }:
    { bottomSheetRef: React.RefObject<BottomSheet> }) {
    return (
        <BottomSheetPaper bottomSheetRef={bottomSheetRef}>
            <TrackList />
        </BottomSheetPaper>
    );
}
