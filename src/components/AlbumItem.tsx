import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { Caption, Card, Chip, useTheme } from "react-native-paper";
import { HotAlbum } from "../types/albumArtist";
import { toReadableDate } from "../utils";

export const Album = ({ item }: { item: HotAlbum }) => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const window = useWindowDimensions();
  const width = window.width / 2 - 15;

  const renderSongCount = useCallback(
    () => <Caption style={styles.count}>{item.size}</Caption>,
    [item.size],
  );

  const geDetail = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
    navigation.navigate(
      //@ts-expect-error
      "AlbumDetail",
      { album: item },
    );
  }, [item, navigation]);

  return (
    <Card style={styles.album} onPress={geDetail}>
      <TouchableWithoutFeedback
        onPress={geDetail}
        onLongPress={() => {
          HapticFeedback.trigger(HapticFeedbackTypes.effectDoubleClick);
          navigation.navigate(
            //@ts-expect-error
            "WebView",
            {
              title: item.name,
              url: item.picUrl,
            },
          );
        }}
      >
        <Card.Cover
          style={[styles.albumPic, { width }]}
          source={{ uri: item.picUrl }}
        />
      </TouchableWithoutFeedback>

      <Card.Title
        title={item.name}
        subtitle={toReadableDate(item.publishTime)}
        subtitleStyle={{
          color: appTheme.dark
            ? appTheme.colors.onSurfaceDisabled
            : appTheme.colors.backdrop,
        }}
        right={renderSongCount}
      />

      <View style={[styles.chips, { width }]}>
        <Chip compact style={styles.chip}>
          {item.type}
        </Chip>
        <Chip compact style={styles.chip}>
          {item.subType}
        </Chip>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  albumPic: {
    height: 200,
  },
  album: {
    marginVertical: "1%",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: "2%",
    paddingHorizontal: "2%",
  },
  chip: {
    margin: "0.5%",
  },
  count: {
    margin: "5%",
    fontSize: 15,
  },
});
