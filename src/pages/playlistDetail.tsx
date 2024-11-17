import {
  FlatListWithHeaders,
  ScalingView,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import { useNavigation, useRoute } from '@react-navigation/native';
import Color from 'color';
import React, { useCallback, useMemo, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import {
  ActivityIndicator,
  Appbar,
  Badge,
  Divider,
  IconButton,
  Portal,
  Tooltip,
  useTheme
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import useSWR from 'swr';
import { HeaderComponent } from '../components/AnimatedHeader';
import { BlurBackground } from '../components/BlurBackground';
import { HeaderSurface } from '../components/HeaderSurface';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistDetailLargeHeader } from '../components/PlaylistDetailLargeHeader';
import { PlaylistTrack, raw2TrackType } from '../components/PlaylistTrack';
import { TracksHeader } from '../components/TracksHeader';
import { useAppDispatch, useAppSelector } from '../hook';
import {
  addPlaylist,
  removePlaylist,
  selectPlaylists,
  setQueueAsync,
  type PlaylistType,
} from '../redux/slices';
import type { TrackType } from '../services/GetTracksService';
import type { Main, Track } from '../types/playlistDetail';

export const PlaylistDetailScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();

  const { name, playlistID } = useRoute().params as PlaylistType;
  const playlists = useAppSelector(selectPlaylists);

  const [showDot, setShowDot] = useState(true);
  const [attempts, setAttempts] = useState(0);

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
        SurfaceComponent={HeaderSurface}
        headerStyle={{ height: 56 + insets.top }}
        headerLeft={
          <Tooltip title="Open in NetEase Music">
            <Appbar.Action
              icon="open-in-new"
              containerColor={Color(
                appTheme.colors.surface
              ).alpha(0.6).rgb().string()}
              onPress={() => Linking.openURL(
                `orpheus://playlist/${playlistID}`
              )} />
          </Tooltip>
        }
        headerRight={
          <>
            {data?.result.commentCount !== 0 && (
              <View>
                <Appbar.Action
                  icon="comment-text-multiple-outline"
                  containerColor={Color(
                    appTheme.colors.surface
                  ).alpha(0.6).rgb().string()}
                  onPress={() => {
                    //@ts-expect-error
                    navigation.push('Comments', {
                      commentThreadId: data?.result.commentThreadId,
                    });
                    setShowDot(false);
                  }} />
                <Badge
                  visible={showDot}
                  style={styles.badge}
                  size={18}
                >
                  {data?.result.commentCount.toLocaleString()}
                </Badge>
              </View>
            )}

            <IconButton
              icon={isInPlaylists
                ? 'playlist-check' : 'playlist-plus'}
              selected={isInPlaylists}
              containerColor={Color(
                appTheme.colors.surface
              ).alpha(0.6).rgb().string()}
              animated
              onPress={togglePlist}
            />
          </>
        }
        headerRightStyle={styles.actions} />
    );
  }, [appTheme, data, insets, isInPlaylists, name, navigation, playlistID, showDot, togglePlist]);

  const renderLargeHeader = useCallback((
    { scrollY }: ScrollLargeHeaderProps
  ) => (
    <ScalingView scrollY={scrollY}>
      <PlaylistDetailLargeHeader playlistID={playlistID} />
      <TracksHeader
        length={data?.result.trackCount || 0}
        onPress={playAll}
      />
    </ScalingView>
  ), [data, playAll, playlistID]);

  if (isLoading || data?.code !== 200 || error) {
    return (
      <BlurBackground>
        <Appbar.Header style={styles.appbar} mode="medium">
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={name} />
          <Appbar.Action
            loading={isValidating && !isLoading}
            icon="refresh"
            selected
            onPress={retry}
          />
        </Appbar.Header>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            style={styles.loading}
          />
        ) : (
          <LottieAnimation
            animation="teapot"
            onPress={retry}
            caption={
              // @ts-expect-error
              `${data?.msg || error?.message}\nTap to retry\nAttempts: ${attempts}`
            }
          />
        )}
      </BlurBackground>
    );
  }

  return (
    <Portal.Host>
      <BlurBackground>
        <FlatListWithHeaders
          LargeHeaderComponent={renderLargeHeader}
          HeaderComponent={renderHeader}
          absoluteHeader
          data={data.result.tracks}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      </BlurBackground>
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: 'transparent'
  },
  loading: {
    marginTop: '50%',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 0,
  },
  actions: {
    width: 'auto',
    flexDirection: 'row',
  }
});
