import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { Alert, StyleSheet, } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, Appbar, Button, List, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import { ArtistNames } from '../components/ArtistNames';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import type { Artist } from '../types/albumArtist';
import type { ListLRProps } from '../types/paperListItem';
import type { Main, Track } from '../types/playlistDetail';

const PlaylistDetail = () => {
  const appTheme = useTheme();

  const params = useRoute().params as { playlistID: number } | undefined;

  const { data, mutate } = useSWR<Main>(
    `https://music.163.com/api/playlist/detail?id=${params || 4926388301}`,
  );

  const renderItem = useCallback((
    { item }: ListRenderItemInfo<Track>
  ) => {
    const renderImg = (props: ListLRProps) => (
      <List.Image
        {...props}
        source={{ uri: item.album.picUrl }}
        style={[props.style, {
          borderRadius: appTheme.roundness
        }]}
      />
    );

    return (
      <List.Item
        title={item.name}
        description={
          <ArtistNames artists={item.artists as Artist[]} />
        }
        left={renderImg}
        onPress={() => {
          Alert.alert(
            'item',
            JSON.stringify(
              item, null, 2
            )
          );
        }}
      />
    );
  }, [appTheme.roundness]);

  const retry = () => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectDoubleClick,
    );
    mutate();
  };

  if (data?.code !== 200) {
    return (
      <LottieAnimation
        animation="breathe"
        onPress={retry}
        caption={
          //@ts-expect-error
          `Failed to load playlist detail\n${data?.msg}\nTap to retry`
        }
      />
    );
  }

  return (
    data ? (
      <FlashList
        data={data.result.tracks}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={68.4}
        renderItem={renderItem}
      />
    ) : (
      <ActivityIndicator size="large" />
    )
  );
};

export const TestScreen = () => {
  const navigation = useNavigation();
  const params = useRoute().params as { playlistID: number } | undefined;

  const { isValidating } = useSWR<Main>(
    `https://music.163.com/api/playlist/detail?id=${params || 4926388301}`,
  );

  return (
    <BlurBackground>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Playlist Detail" />
        <Button
          compact
          loading={isValidating}
          icon="check-circle-outline"
        >
          {isValidating ? 'Validating' : 'Validated'}
        </Button>
      </Appbar.Header>

      <PlaylistDetail />
    </BlurBackground>
  );
};

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: 'transparent'
  }
});
