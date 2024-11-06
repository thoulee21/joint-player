import BottomSheet from '@gorhom/bottom-sheet';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { Storage } from '../utils';
import { StorageKeys } from '../utils/storageKeys';

export function Player() {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const insets = useSafeAreaInsets();
  const [placeholderKeyword, setPlaceholderKeyword] = useState('');

  useEffect(() => {
    const restoreInitKeyword = async () => {
      const storedKeyword = await Storage.get(StorageKeys.Keyword);
      if (storedKeyword) {
        setPlaceholderKeyword(storedKeyword);
      }
    };

    restoreInitKeyword();
  }, []);

  const goSearch = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
    //@ts-expect-error
    navigation.navigate('Search');
  }, [navigation]);

  return (
    <Portal.Host>
      <BlurBackground style={{ paddingTop: insets.top }}>
        <Searchbar
          placeholder={placeholderKeyword || 'Search for songs'}
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
