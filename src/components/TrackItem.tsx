import BottomSheet from '@gorhom/bottom-sheet';
import Color from 'color';
import React, { memo, useCallback } from 'react';
import { TextStyle } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { removeFromQueueAsync } from '../redux/slices';
import { TrackType } from '../services';

export interface ListRightProps {
    color: string;
    style?: Style;
}

export const TrackItem = (
    { item, index, navigation, bottomSheetRef }: {
        item: TrackType;
        index: number;
        navigation: any;
        bottomSheetRef: React.RefObject<BottomSheet>
    }
) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();
    const currentTrack = useActiveTrack();

    const active = currentTrack?.url === item.url;
    const titleStyle: TextStyle = {
        color: active
            ? appTheme.colors.primary
            : appTheme.colors.onBackground,
        fontWeight: active ? 'bold' : 'normal',
    };

    const chooseTrack = useCallback(async () => {
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
        bottomSheetRef.current?.close();
    }, [bottomSheetRef, index]);

    const MvButton = memo((props: ListRightProps) => {
        const goMV = () => {
            if (!active) {
                chooseTrack();
            } else {
                bottomSheetRef.current?.close();
            }
            //@ts-ignore
            navigation.navigate('MvDetail');
        };

        if (item.mvid) {
            return (
                <IconButton {...props}
                    icon="video-outline"
                    selected={active}
                    onPress={goMV}
                />
            );
        }
    });

    const remove = () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectDoubleClick
        );
        dispatch(removeFromQueueAsync(index));
    };

    return (
        <List.Item
            title={item.title}
            description={`${item.artist} - ${item.album}`}
            onPress={chooseTrack}
            onLongPress={remove}
            descriptionNumberOfLines={1}
            titleStyle={titleStyle}
            style={{
                backgroundColor: active
                    ? Color(appTheme.colors.secondaryContainer)
                        .fade(appTheme.dark ? 0.4 : 0.6).string()
                    : undefined,
            }}
            left={({ color, style }) => (
                <List.Icon
                    style={style}
                    color={active ? appTheme.colors.primary : color}
                    icon={active ? 'music-circle' : 'music-circle-outline'}
                />
            )}
            right={(props) => <MvButton {...props} />}
        />
    );
};
