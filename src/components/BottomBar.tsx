import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { RefObject } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Appbar } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

export const BottomBar = ({ bottomSheetRef }:
  { bottomSheetRef: RefObject<BottomSheetModal> }
) => {
  const navigation = useNavigation();
  const track = useActiveTrack();

  return (
    <Appbar.Header
      style={styles.bottomBar}
      mode="center-aligned"
    >
      <Appbar.Action
        icon="video-outline"
        disabled={track?.mvid === 0
          || typeof track?.mvid === 'undefined'}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
          );
          // @ts-ignore
          navigation.push('MvDetail');
        }}
      />
      <Appbar.Content
        title={track?.album || 'No Album'}
        titleStyle={styles.bottomTitle}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
          );
          //@ts-ignore
          navigation.push('AlbumDetail', {
            album: track?.albumRaw,
          });
        }}
        disabled={
          typeof track?.albumRaw === 'undefined'
          || !track?.album}
      />
      <Appbar.Action
        icon="menu-open"
        disabled={!track}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
          );
          bottomSheetRef.current?.present();
        }}
      />
    </Appbar.Header>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: 'transparent',
  },
  bottomTitle: {
    fontSize: 16,
  },
});
