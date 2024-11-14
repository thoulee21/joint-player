import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import { BlurView } from 'expo-blur';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import ImageColors from 'react-native-image-colors';
import { type AndroidImageColors } from 'react-native-image-colors/build/types';
import { Button, Card, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { useAppSelector, useDebounce } from '../hook';
import { blurRadius, selectDevModeEnabled } from '../redux/slices';
import { Main as MvMain } from '../types/mv';
import { mvLog } from '../utils/logger';
import { placeholderImg } from './TrackInfo';

export const MvCover = ({ children }: PropsWithChildren) => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const devModeEnabled = useAppSelector(selectDevModeEnabled);
  const blurRadiusValue = useAppSelector(blurRadius);

  const [visible, setVisible] = useState(false);
  const showDialog = useCallback(() => setVisible(true), []);
  const hideDialog = useCallback(() => setVisible(false), []);

  const { height: windowsHeight } = Dimensions.get('window');
  const track = useActiveTrack();
  const { data } = useSWR<MvMain>(
    `http://music.163.com/api/mv/detail?id=${track?.mvid}`
  );

  const printMvData = useCallback(() => {
    if (devModeEnabled && data) {
      mvLog.info(data.data);
      showDialog();
    }
  }, [data, devModeEnabled, showDialog]);

  const copyMvData = useCallback(() => {
    Clipboard.setString(
      JSON.stringify(data?.data, null, 2)
    );
    ToastAndroid.showWithGravity(
      'Copied to clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  }, [data]);

  const handleStatusBarStyle = useDebounce(async () => {
    const colors = await ImageColors.getColors(data?.data.cover || placeholderImg);
    const imgColor = Color((colors as AndroidImageColors).average);

    StatusBar.setBarStyle(
      imgColor.isDark() ? 'light-content' : 'dark-content'
    );
  });

  const restoreStatusBarStyle = useDebounce(() => {
    StatusBar.setBarStyle(
      appTheme.dark ? 'light-content' : 'dark-content'
    );
  });

  useEffect(() => {
    handleStatusBarStyle();

    return restoreStatusBarStyle;
  }, [handleStatusBarStyle, restoreStatusBarStyle]);

  const viewMvPic = useCallback(() => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectTick
    );
    if (data?.data.cover) {
      // @ts-ignore
      navigation.navigate('WebView', {
        title: data?.data.name,
        url: data?.data.cover,
      });
    }
  }, [data, navigation]);

  return (
    <>
      <Card
        style={styles.square}
        onPress={printMvData}
        onLongPress={viewMvPic}
      >
        <ImageBackground
          source={{ uri: data?.data.cover || placeholderImg }}
        >
          <View style={[
            styles.cover,
            { height: windowsHeight / 3 }
          ]}>
            <BlurView
              tint={appTheme.dark ? 'dark' : 'light'}
              intensity={blurRadiusValue}
            >
              {children}
            </BlurView>
          </View>
        </ImageBackground>
      </Card>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.dialog}
        >
          <Dialog.Title>MV Detail</Dialog.Title>
          <Dialog.ScrollArea style={styles.smallPadding}>
            <ScrollView
              contentContainerStyle={styles.biggerPadding}
            >
              <Text selectable>
                {data && (
                  JSON.stringify(
                    data.data,
                    null,
                    2
                  )
                )}
              </Text>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              icon="content-copy"
              onPress={copyMvData}
            >
              Copy
            </Button>
            <Button onPress={hideDialog}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  cover: {
    justifyContent: 'flex-end',
  },
  square: {
    borderRadius: 0,
  },
  dialog: {
    maxHeight: '80%',
  },
  smallPadding: {
    paddingHorizontal: 0,
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});
