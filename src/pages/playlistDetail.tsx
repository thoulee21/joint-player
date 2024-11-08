import { useNavigation, useRoute } from '@react-navigation/native';
import fetchRetry from 'fetch-retry';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DraggableFlatList, { type RenderItemParams } from 'react-native-draggable-flatlist';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, Appbar, Badge, Chip, Dialog, Divider, Portal, Surface, Text, Tooltip, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import useSWR from 'swr';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistTrack, raw2TrackType } from '../components/PlaylistTrack';
import { TracksHeader } from '../components/TracksHeader';
import { useAppDispatch } from '../hook';
import { setQueueAsync } from '../redux/slices';
import type { TrackType } from '../services/GetTracksService';
import type { Main, Track } from '../types/playlistDetail';

interface RouteParams {
  playlistID: number;
  name: string;
}

export const PlaylistDetailScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const appTheme = useTheme();

  const { name, playlistID } = useRoute().params as RouteParams;
  const [dialogVisible, setDialogVisible] = useState(false);

  const fetcher = async (url: string): Promise<Main> => {
    const response = await fetchRetry(fetch, {
      retries: 20, retryDelay: 1000,
    })(url);
    const data = await response.json();
    return data;
  };

  const { data, mutate, isLoading, isValidating, error } = useSWR<Main>(
    `https://music.163.com/api/playlist/detail?id=${playlistID}&limit=100`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const retry = useCallback(() => {
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

  if (isLoading || data?.code !== 200) {
    return (
      <BlurBackground>
        <Appbar.Header style={styles.appbar}>
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
          < LottieAnimation
            animation="teapot"
            onPress={retry}
            // @ts-expect-error
            caption={data?.msg || error?.message}
          />
        )}
      </BlurBackground>
    );
  }

  return (
    <Portal.Host>
      <BlurBackground>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title={name} onPress={() => {
            ToastAndroid.show(
              name, ToastAndroid.LONG
            );
          }} />
          <View>
            <Appbar.Action
              icon="comment-text-multiple-outline"
              disabled={data.result.commentCount === 0}
              onPress={() => {
                //@ts-expect-error
                navigation.push('Comments', {
                  commentThreadId: data.result.commentThreadId,
                });
              }}
            />
            <Badge style={styles.badge} size={18}>
              {data.result.commentCount.toLocaleString()}
            </Badge>
          </View>
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
            <Tooltip title={data.result.creator.userId.toString()}>
              <Chip
                style={styles.creator}
                avatar={
                  <Image source={{
                    uri: data?.result.creator.avatarUrl
                  }} />
                }
              >
                {data?.result.creator.nickname}
              </Chip>
            </Tooltip>

            <TouchableOpacity onPress={() => {
              if (data.result.description) {
                if (data?.result.description.length > 100) {
                  setDialogVisible(true);
                }
              }
            }}>
              <Text numberOfLines={6}>
                {data?.result.description || 'No Description'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tags}>
          {data?.result.tags.map(tag => (
            <Chip
              key={tag}
              icon="tag-outline"
              compact
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
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Playlist Description</Dialog.Title>
          <Dialog.ScrollArea style={styles.smallPadding}>
            <ScrollView style={styles.biggerPadding}>
              <Text selectable>
                {data.result.description}
              </Text>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Appbar.Action
              icon="close"
              onPress={() => setDialogVisible(false)}
            />
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
  creator: {
    marginBottom: '5%',
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
  badge: {
    position: 'absolute',
    top: 4,
    right: 0,
  },
});
