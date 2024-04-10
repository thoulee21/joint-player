import BottomSheet, {
    BottomSheetFlatList
} from '@gorhom/bottom-sheet';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    ActivityIndicator,
    Divider,
    List,
    useTheme
} from "react-native-paper";
import TrackPlayer, {
    Track,
    useActiveTrack
} from 'react-native-track-player';
import { BottomSheetPaper } from ".";
import playlistData from "../assets/data/playlist.json";

function TrackList({ bottomSheetRef }:
    { bottomSheetRef: React.RefObject<BottomSheet> }
) {
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

        getQueue();
    }, [currentTrack]);

    const renderTrack = ({ item, index }: { item: Track, index: number }) => {
        let active = false;

        if (currentTrack?.id && item.id) {
            active = currentTrack?.id === item.id;
        } else if (index === 0) {
            active = false;
        }

        return (
            <List.Item
                title={item.title}
                description={item.artist}
                style={{
                    backgroundColor:
                        active
                            ? appTheme.colors.secondaryContainer
                            : undefined,
                }}
                left={(props) =>
                    <List.Icon
                        {...props}
                        icon={active
                            ? "music-circle"
                            : "music-circle-outline"}
                    />
                }
                onPress={async () => {
                    await TrackPlayer.skip(index);

                    setTimeout(() => {
                        bottomSheetRef.current?.close();
                    }, 300);
                }}
            />
        )
    }

    return (
        <BottomSheetFlatList
            style={{ height: '100%' }}
            // Use playlistData as a fallback
            data={queue.length > 0 ? queue : playlistData as Track[]}
            ListEmptyComponent={() =>
                <View>
                    <ActivityIndicator
                        size="large"
                        style={styles.loading}
                    />
                </View>
            }
            renderItem={renderTrack}
            ItemSeparatorComponent={() => <Divider />}
        />
    );
}

export function TrackListSheet({ bottomSheetRef }:
    { bottomSheetRef: React.RefObject<BottomSheet> }) {
    return (
        <BottomSheetPaper bottomSheetRef={bottomSheetRef}>
            <TrackList bottomSheetRef={bottomSheetRef} />
        </BottomSheetPaper>
    );
}

const styles = StyleSheet.create({
    loading: {
        marginTop: '20%'
    }
})
