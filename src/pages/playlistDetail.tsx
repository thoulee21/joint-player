import {
  FlatListWithHeaders,
  ScalingView,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, StatusBar, StyleSheet, View } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
  ActivityIndicator,
  Button,
  Divider,
  IconButton,
  Menu,
  Portal,
  useTheme
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import useSWR from 'swr';
import { HeaderComponent } from '../components/AnimatedHeader';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistDetailLargeHeader } from '../components/PlaylistDetailLargeHeader';
import {
  PlaylistTrack,
  raw2TrackType,
} from '../components/PlaylistTrack';
import { PoweredBy } from '../components/PoweredBy';
import { TracksHeader } from '../components/TracksHeader';
import { useAppDispatch, useAppSelector } from '../hook';
import {
  addPlaylist,
  removePlaylist,
  selectDevModeEnabled,
  selectPlaylists,
  setQueueAsync,
  type PlaylistType
} from '../redux/slices';
import type { TrackType } from '../services/GetTracksService';
import type { Main, Track } from '../types/playlistDetail';

export const PlaylistDetailScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();

  const { name, playlistID } = useRoute().params as PlaylistType;
  const playlists = useAppSelector(selectPlaylists);
  const isDev = useAppSelector(selectDevModeEnabled);

  const [attempts, setAttempts] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const isInPlaylists = useMemo(() => (
    playlists.some((pl) => (
      pl.playlistID === playlistID
    ))
  ), [playlistID, playlists]);

  const togglePlist = useCallback(() => {
    if (name && playlistID) {
      HapticFeedback.trigger(
        HapticFeedbackTypes.effectHeavyClick
      );

      if (isInPlaylists) {
        dispatch(removePlaylist({ playlistID, name }));
      } else {
        dispatch(addPlaylist({ playlistID, name }));
      }
    }
  }, [dispatch, isInPlaylists, name, playlistID]);

  const { data, mutate, isLoading, isValidating, error } = useSWR<Main>(
    `https://music.163.com/api/playlist/detail?id=${playlistID}`,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const retry = useCallback(() => {
    setAttempts(prev => prev + 1);
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectDoubleClick,
    );
    mutate();
  }, [mutate]);

  const renderItem = useCallback((
    { item, index }: { item: Track, index: number }
  ) => (
    <PlaylistTrack item={item} index={index} />
  ), []);

  const keyExtractor = useCallback(
    (item: Track) => item.id.toString(), []
  );

  const playAll = useCallback(async () => {
    const tracksData = data?.result.tracks.map(
      raw => raw2TrackType(raw)
    );

    await dispatch(
      setQueueAsync(tracksData as TrackType[])
    );
    await TrackPlayer.play();
  }, [data, dispatch]);

  const renderHeader = useCallback((
    props: ScrollHeaderProps
  ) => {
    return (
      <HeaderComponent
        {...props}
        title={name}
        noBottomBorder
        headerStyle={{
          height: 56 + insets.top,
          backgroundColor: appTheme.colors.surfaceVariant
        }}
        headerRight={
          <IconButton
            icon={isInPlaylists
              ? 'playlist-check' : 'playlist-plus'}
            selected={isInPlaylists}
            animated
            onPress={togglePlist}
          />
        }
      />
    );
  }, [appTheme.colors.surfaceVariant, insets.top, isInPlaylists, name, togglePlist]);

  const renderLargeHeader = useCallback((
    { scrollY }: ScrollLargeHeaderProps
  ) => (
    <ScalingView
      scrollY={scrollY}
      style={{ backgroundColor: appTheme.colors.surfaceVariant }}
    >
      <PlaylistDetailLargeHeader playlistID={playlistID} />
      <TracksHeader
        length={data?.result.trackCount || 0}
        onPress={playAll}
        right={
          <View style={styles.row}>
            <IconButton
              icon="comment-text-multiple-outline"
              size={18}
              disabled={!data?.result.commentCount}
              onPress={() => {
                //@ts-expect-error
                navigation.push('Comments', {
                  commentThreadId: data?.result.commentThreadId,
                });
              }}
            />

            <Menu
              visible={menuVisible}
              onDismiss={() => { setMenuVisible(false); }}
              statusBarHeight={StatusBar.currentHeight}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  size={18}
                  onPress={() => { setMenuVisible(true); }}
                />
              }
            >
              <Menu.Item
                title={t('playlistDetail.playlist.menu.openInApp')}
                leadingIcon="open-in-new"
                onPress={() => Linking.openURL(
                  `orpheus://playlist/${playlistID}`
                )}
              />
            </Menu>
          </View>
        }
      />
    </ScalingView>
  ), [appTheme.colors.surfaceVariant, data, menuVisible, navigation, playAll, playlistID, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: Boolean(
        isLoading || data?.code !== 200 || error
      ),
      headerTitle: name
    });
  }, [data?.code, error, isLoading, name, navigation]);

  if (isLoading || data?.code !== 200 || error) {
    return (
      <View style={[
        styles.root,
        { backgroundColor: appTheme.colors.surfaceVariant }
      ]}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            style={styles.loading}
          />
        ) : (
          <LottieAnimation
            animation="teapot"
            // @ts-expect-error
            caption={`${data?.msg || error?.message}`.concat(
              isDev ? `\nAttempts: ${attempts}` : ''
            )}
          >
            <Button
              icon="refresh"
              style={styles.retry}
              mode="contained-tonal"
              loading={isValidating && !isLoading}
              onPress={retry}
            >
              {t('playlistDetail.retry')}
            </Button>
          </LottieAnimation>
        )}
      </View>
    );
  }

  return (
    <Portal.Host>
      <FlatListWithHeaders
        LargeHeaderComponent={renderLargeHeader}
        HeaderComponent={renderHeader}
        overScrollMode="never"
        scrollToOverflowEnabled={false}
        data={data.result.tracks}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListFooterComponent={<PoweredBy />}
      />
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  appbar: {
    backgroundColor: 'transparent'
  },
  loading: {
    marginTop: '50%',
  },
  retry: {
    alignSelf: 'center',
    margin: '5%',
  },
  row: {
    flexDirection: 'row',
  }
});
