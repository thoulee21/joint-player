import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import DraggableFlatList, {
  type RenderItemParams
} from 'react-native-draggable-flatlist';
import HapticFeedback, {
  HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import {
  ActivityIndicator,
  Appbar,
  Badge,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  Portal,
  Surface,
  Text,
  Tooltip,
  useTheme
} from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import useSWR from 'swr';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import {
  PlaylistTrack,
  raw2TrackType,
} from '../components/PlaylistTrack';
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
  const appTheme = useTheme();

  const { name, playlistID } = useRoute().params as PlaylistType;
  const playlists = useAppSelector(selectPlaylists);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [showDot, setShowDot] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const isInPlaylists = useMemo(() => (
    playlists.some(
      (pl) => pl.playlistID === playlistID
    )
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
  );

  const retry = useCallback(() => {
    setAttempts(prev => prev + 1);
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectDoubleClick,
    );
    mutate();
  }, [mutate]);

  const renderItem = useCallback((
    props: RenderItemParams<Track>
  ) => (
    <PlaylistTrack {...props} />
  ), []);

  const keyExtractor = useCallback(
    (item: Track) => item.id.toString(), []
  );

  const playAll = async () => {
    const tracksData = data?.result.tracks.map(
      raw => raw2TrackType(raw)
    );

    await dispatch(
      setQueueAsync(tracksData as TrackType[])
    );
    await TrackPlayer.play();
  };

  if (
    isLoading || data?.code !== 200 || error
  ) {
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
        <Appbar.Header style={styles.appbar} mode="medium">
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={name} onPress={() => {
            setDialogVisible(true);
          }} />

          <Tooltip title="Open in NetEase Music">
            <Appbar.Action
              icon="open-in-new"
              onPress={() => {
                Linking.openURL(
                  `orpheus://playlist/${playlistID}`
                );
              }}
            />
          </Tooltip>

          {data.result.commentCount !== 0 && (
            <View>
              <Appbar.Action
                icon="comment-text-multiple-outline"
                onPress={() => {
                  //@ts-expect-error
                  navigation.push('Comments', {
                    commentThreadId: data.result.commentThreadId,
                  });
                  setShowDot(false);
                }}
              />
              <Badge
                visible={showDot}
                style={styles.badge}
                size={18}
              >
                {data.result.commentCount.toLocaleString()}
              </Badge>
            </View>
          )}

          <IconButton
            icon={isInPlaylists
              ? 'playlist-check' : 'playlist-plus'}
            selected={isInPlaylists}
            animated
            onPress={togglePlist}
          />
        </Appbar.Header>

        <View style={styles.header}>
          <TouchableWithoutFeedback
            onLongPress={() => {
              HapticFeedback.trigger(
                HapticFeedbackTypes.effectDoubleClick,
              );
              //@ts-expect-error
              navigation.push('WebView', {
                title: data?.result.name,
                url: data?.result.coverImgUrl,
              });
            }}
          >
            <Surface
              elevation={5}
              style={[styles.cover, {
                borderRadius: appTheme.roundness,
              }]}
            >
              <Image
                style={[styles.cover, {
                  borderRadius: appTheme.roundness,
                }]}
                source={{ uri: data?.result.coverImgUrl }}
              />
            </Surface>
          </TouchableWithoutFeedback>

          <View style={styles.headerRight}>
            <Tooltip
              title={data.result.creator.signature || 'No Signature'}
            >
              <Chip avatar={
                <Image source={{
                  uri: data?.result.creator.avatarUrl
                }} />
              }>
                {data?.result.creator.nickname}
              </Chip>
            </Tooltip>

            <View style={styles.row}>
              <Button icon="heart-outline" compact>
                {data.result.subscribedCount.toLocaleString()}
              </Button>
              <Button icon="share-outline" compact onPress={() => {
                Share.share({
                  title: data.result.name,
                  message: `Check out ${data.result.name} on NetEase Music!\nhttps://music.163.com/#/playlist?id=${playlistID}`,
                  url: `https://music.163.com/#/playlist?id=${playlistID}`,
                }, {
                  dialogTitle: 'Share Playlist',
                  tintColor: appTheme.colors.primary,
                  subject: data.result.name,
                });
              }}>
                {data.result.shareCount.toLocaleString()}
              </Button>
            </View>

            <TouchableOpacity onPress={() => {
              if (data.result.description) {
                setDialogVisible(true);
              }
            }}>
              <Text numberOfLines={4}>
                {data?.result.description
                  || `${data.result.name}\nNo Description :(`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tags}>
          {data?.result.tags.map(tag => (
            <Chip
              key={tag}
              icon="tag-text-outline"
              mode="outlined"
              style={styles.tag}
            >{tag}</Chip>
          ))}
        </View>

        <TracksHeader
          length={data.result.trackCount}
          onPress={playAll}
        />
        <DraggableFlatList
          data={data.result.tracks}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          containerStyle={[styles.container, {
            backgroundColor: appTheme.colors.surface,
          }]}
          activationDistance={20}
          ItemSeparatorComponent={Divider}
        />
      </BlurBackground>

      <Portal>
        <Dialog
          visible={dialogVisible}
          style={styles.dialog}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>{data.result.name}</Dialog.Title>
          <ScrollView style={styles.biggerPadding}>
            <Text selectable>
              {data.result.description}
            </Text>
          </ScrollView>
          <Dialog.Actions>
            <Button onPress={() => {
              setDialogVisible(false);
            }}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
    backgroundColor: 'transparent'
  },
  loading: {
    marginTop: '50%',
  },
  tags: {
    marginHorizontal: '2%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    margin: '1%',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cover: {
    width: 150,
    height: 150,
    aspectRatio: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: '3.5%',
    paddingBottom: '2%',
  },
  headerRight: {
    flex: 1,
    marginLeft: '3%',
    alignItems: 'flex-start',
  },
  dialog: {
    maxHeight: '80%',
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 0,
  },
});
