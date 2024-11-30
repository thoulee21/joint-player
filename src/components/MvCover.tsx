import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import ImageColors from 'react-native-image-colors';
import { type AndroidImageColors } from 'react-native-image-colors/build/types';
import { Button, Card, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';
import { Main as MvMain } from '../types/mv';
import { rootLog } from '../utils/logger';
import { ImageBlur, ImageBlurView } from './ImageBlur';
import { placeholderImg } from './TrackInfo';

const MvContext = createContext<{ imgColor?: Color } | null>(null);
export const useMvContext = () => React.useContext(MvContext);

export const MvCover = ({ children }: PropsWithChildren) => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const devModeEnabled = useAppSelector(selectDevModeEnabled);
  const [visible, setVisible] = useState(false);
  const [imgColor, setImgColor] = useState<Color>();

  const showDialog = useCallback(() => setVisible(true), []);
  const hideDialog = useCallback(() => setVisible(false), []);

  const track = useActiveTrack();
  const { data } = useSWR<MvMain>(
    `http://music.163.com/api/mv/detail?id=${track?.mvid}`
  );

  const printMvData = useCallback(() => {
    if (devModeEnabled && data) { showDialog(); }
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

  const handleStatusBarStyle = useCallback(async () => {
    const colors = await ImageColors.getColors(
      data?.data?.cover || placeholderImg
    );
    rootLog.debug('MvCover colors', colors);
    setImgColor(Color((colors as AndroidImageColors).average));
  }, [data?.data?.cover]);

  useEffect(() => {
    handleStatusBarStyle();

    return StatusBar.setBarStyle(
      appTheme.dark ? 'light-content' : 'dark-content'
    );
  }, [appTheme.dark, handleStatusBarStyle]);

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
    <MvContext.Provider value={{ imgColor }}>
      <StatusBar barStyle={
        imgColor?.isDark() ? 'light-content' : 'dark-content'
      } />
      <Card
        style={styles.square}
        onPress={printMvData}
        onLongPress={viewMvPic}
      >
        <ImageBlur
          src={data?.data.cover || placeholderImg}
          aspectRatio="landscape"
          resizeMode="cover"
          blurChildren={
            <View style={styles.cover}>
              <ImageBlurView>
                {children}
              </ImageBlurView>
            </View>
          }
        />
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
            >Copy</Button>
            <Button
              textColor={appTheme.colors.outline}
              onPress={hideDialog}
            >Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </MvContext.Provider>
  );
};

const styles = StyleSheet.create({
  cover: {
    flex: 1,
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
