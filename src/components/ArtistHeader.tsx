import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { Card, Text, useTheme } from "react-native-paper";
import { Artist } from "../types/albumArtist";

export const ArtistHeader = ({ artist }: { artist?: Artist }) => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const viewArtistPic = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
    //@ts-ignore
    navigation.push("WebView", {
      url: artist?.picUrl,
      title: artist?.name,
    });
  }, [artist, navigation]);

  return (
    <View style={[styles.header]}>
      <View style={styles.artistName}>
        <Text variant="headlineSmall">{artist?.name}</Text>
        <Text
          style={[
            styles.artistAlias,
            {
              color: appTheme.dark
                ? appTheme.colors.onSurfaceDisabled
                : appTheme.colors.backdrop,
            },
          ]}
        >
          {artist?.alias.join(", ")}
        </Text>
      </View>

      <Card onLongPress={viewArtistPic}>
        <Card.Cover source={{ uri: artist?.picUrl }} />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginVertical: "1%",
  },
  artistName: {
    flexDirection: "row",
    alignItems: "baseline",
    margin: "3%",
    flexWrap: "wrap",
  },
  artistAlias: {
    marginHorizontal: "1.5%",
  },
});
