import BottomSheet from '@gorhom/bottom-sheet';
import Color from 'color';
import React from 'react';
import { TextStyle } from 'react-native';
import { IconButton, List, useTheme } from 'react-native-paper';
import TrackPlayer, {
    Track,
    useActiveTrack
} from 'react-native-track-player';

export const TrackItem = (
    { item, index, navigation, bottomSheetRef }: {
        item: Track;
        index: number;
        navigation: any;
        bottomSheetRef: React.RefObject<BottomSheet>
    }
) => {
    const appTheme = useTheme();
    const currentTrack = useActiveTrack();

    const active = currentTrack?.url === item.url;
    const titleStyle: TextStyle = {
        color: active
            ? appTheme.colors.primary
            : appTheme.colors.onBackground,
        fontWeight: active ? 'bold' : 'normal',
    };

    const chooseTrack = async () => {
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
        bottomSheetRef.current?.close();
    };

    return (
        <List.Item
            title={item.title}
            description={`${item.artist} - ${item.album}`}
            onPress={chooseTrack}
            descriptionNumberOfLines={1}
            titleStyle={titleStyle}
            style={{
                backgroundColor: active
                    ? Color(appTheme.colors.secondaryContainer)
                        .fade(appTheme.dark ? 0.4 : 0.6).string()
                    : undefined,
            }}
            left={props => (
                <List.Icon {...props}
                    color={active ? appTheme.colors.primary : undefined}
                    icon={active ? 'music-circle' : 'music-circle-outline'}
                />
            )}
            right={props => (
                item.mvid ?
                    <IconButton {...props}
                        icon="video-outline"
                        selected={active}
                        onPress={() => {
                            if (!active) {
                                chooseTrack();
                            } else {
                                bottomSheetRef.current?.close();
                            }
                            //@ts-ignore
                            navigation.navigate('MvDetail');
                        }}
                    /> : null
            )}
        />
    );
};
