import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, Text, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { Albums } from '../components/Albums';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { Artist as ArtistType, Main } from '../types/albumArtist';

export function Artist() {
  const appTheme = useTheme();
  const navigation = useNavigation();

  const { artist } = (useRoute().params as { artist: ArtistType });
  const { data, error, mutate } = useSWRInfinite<Main>((index) =>
    `http://music.163.com/api/artist/albums/${artist.id}?offset=${index * 10}&limit=10&total=true`,
  );

  if (error) {
    return (
      <BlurBackground>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={artist.name} />
          <Appbar.Action icon="refresh" onPress={() => mutate()} />
        </Appbar.Header>

        <LottieAnimation
          animation="breathe"
          caption="Try to refresh later"
        >
          <Text style={[
            styles.error,
            { color: appTheme.colors.error },
          ]}>
            Error: {error.message}
          </Text>
        </LottieAnimation>
      </BlurBackground>
    );
  }

  if (!data) {
    return (
      <BlurBackground style={styles.container}>
        <ActivityIndicator size="large" />
      </BlurBackground>
    );
  }

  return (
    <View style={styles.container}>
      <Albums artistID={artist.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    textAlign: 'center',
  },
  header: {
    backgroundColor: 'transparent',
  },
});
