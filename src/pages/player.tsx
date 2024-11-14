import { type BottomSheetModal } from '@gorhom/bottom-sheet';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Portal, Searchbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { BottomBar } from '../components/BottomBar';
import { PlayControls } from '../components/PlayControls';
import { Progress } from '../components/Progress';
import { TrackInfo } from '../components/TrackInfo';
import { TrackListSheet } from '../components/TrackListSheet';
import { UpdateSnackbar } from '../components/UpdateSnackbar';
import { useAppSelector } from '../hook';
import { selectSearchHistory } from '../redux/slices';

export function Player() {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const searchHistory = useAppSelector(selectSearchHistory);

  const goSearch = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
    //@ts-expect-error
    navigation.navigate('Search');
  }, [navigation]);

  return (
    <Portal.Host>
      <BlurBackground style={{ paddingTop: insets.top }}>
        <Searchbar
          placeholder={searchHistory[searchHistory.length - 1] || 'Search for songs'}
          placeholderTextColor={appTheme.dark
            ? appTheme.colors.onSurfaceDisabled
            : appTheme.colors.backdrop}
          value=""
          style={styles.searchbar}
          inputStyle={{ color: appTheme.colors.onSurface }}
          icon="menu"
          iconColor={appTheme.colors.onSurface}
          onIconPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
          traileringIcon="magnify"
          onTraileringIconPress={goSearch}
          onPress={goSearch}
        />

        <ScrollView
          style={styles.screenContainer}
          showsVerticalScrollIndicator={false}
        >
          <TrackInfo />
          <Progress />
          <PlayControls />
        </ScrollView>

        <BottomBar bottomSheetRef={bottomSheetRef} />
        <Portal>
          <UpdateSnackbar />
        </Portal>
        <Portal>
          <TrackListSheet
            bottomSheetRef={bottomSheetRef}
          />
        </Portal>
      </BlurBackground>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flex: 1,
  },
  searchbar: {
    margin: 10,
    backgroundColor: 'transparent',
  },
});
