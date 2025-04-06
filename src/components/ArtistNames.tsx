import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TextStyle,
  ToastAndroid,
} from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { Text, useTheme } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import useSWRInfinite from "swr/infinite";
import { Artist, type Main } from "../types/albumArtist";

const Name = ({
  item,
  goArtist,
  textStyle,
}: {
  item: Artist;
  goArtist: (item: Artist) => void;
  textStyle: StyleProp<TextStyle>;
}) => {
  const appTheme = useTheme();

  const { data } = useSWRInfinite<Main>(
    (index) =>
      `http://music.163.com/api/artist/albums/${item.id}?offset=${index * 10}&limit=10&total=true`,
  );

  const onPress = useCallback(() => {
    if (data && data[0].artist) {
      goArtist(data[0].artist);
    } else {
      ToastAndroid.show("No artist data found", ToastAndroid.SHORT);
    }
  }, [data, goArtist]);

  return (
    <Text
      onPress={onPress}
      style={[textStyle, { color: appTheme.colors.primary }]}
    >
      {item.name}
    </Text>
  );
};

export const ArtistNames = ({
  textStyle,
  artists,
}: {
  textStyle?: StyleProp<TextStyle>;
  artists?: Artist[];
}) => {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const track = useActiveTrack();

  const themedGray = appTheme.dark
    ? appTheme.colors.onSurfaceDisabled
    : appTheme.colors.backdrop;

  const goArtist = useCallback(
    (item: Artist) => {
      HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
      //@ts-ignore
      navigation.push("Artist", {
        artist: item,
      });
    },
    [navigation],
  );

  const renderSeparator = useCallback(
    () => <Text style={[textStyle, { color: themedGray }]}>/</Text>,
    [textStyle, themedGray],
  );

  const renderItem = useCallback(
    ({ item }: { item: Artist }) => (
      <Name item={item} goArtist={goArtist} textStyle={textStyle} />
    ),
    [goArtist, textStyle],
  );

  return (
    <FlatList
      data={artists || (track?.artists as Artist[])}
      horizontal
      style={styles.names}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={renderSeparator}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  names: {
    maxWidth: "80%",
  },
});
