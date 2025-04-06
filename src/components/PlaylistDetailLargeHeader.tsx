import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  Appbar,
  Button,
  Chip,
  Dialog,
  Portal,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import useSWR from "swr";
import type { Main } from "../types/playlistDetail";

export const PlaylistDetailLargeHeader = ({
  playlistID,
}: {
  playlistID: number;
}) => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [dialogVisible, setDialogVisible] = useState(false);

  const { data } = useSWR<Main>(
    `https://music.163.com/api/playlist/detail?id=${playlistID}`,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  return (
    <>
      <Appbar.Header style={styles.appbar} statusBarHeight={0}>
        <Appbar.Content
          title={data?.result.name}
          onPress={() => {
            setDialogVisible(true);
          }}
        />
      </Appbar.Header>

      <View style={styles.header}>
        <TouchableWithoutFeedback
          onLongPress={() => {
            HapticFeedback.trigger(HapticFeedbackTypes.effectDoubleClick);
            //@ts-expect-error
            navigation.push("WebView", {
              title: data?.result.name,
              url: data?.result.coverImgUrl,
            });
          }}
        >
          <Surface
            elevation={5}
            style={[
              styles.cover,
              {
                borderRadius: appTheme.roundness,
              },
            ]}
          >
            <Image
              style={[
                styles.cover,
                {
                  borderRadius: appTheme.roundness,
                },
              ]}
              source={{ uri: data?.result.coverImgUrl }}
            />
          </Surface>
        </TouchableWithoutFeedback>

        <View style={styles.headerRight}>
          <Chip
            avatar={
              <Image
                source={{
                  uri: data?.result.creator.avatarUrl,
                }}
              />
            }
          >
            {data?.result.creator.nickname}
          </Chip>

          <View style={styles.row}>
            <Button icon="heart-outline" compact>
              {data?.result.subscribedCount.toLocaleString()}
            </Button>
            <Button
              icon="share-outline"
              compact
              onPress={() => {
                Share.share(
                  {
                    title: data?.result.name,
                    message: `Check out ${data?.result.name} on NetEase Music!\nhttps://music.163.com/#/playlist?id=${playlistID}`,
                    url: `https://music.163.com/#/playlist?id=${playlistID}`,
                  },
                  {
                    dialogTitle: "Share Playlist",
                    tintColor: appTheme.colors.primary,
                    subject: data?.result.name,
                  },
                );
              }}
            >
              {data?.result.shareCount.toLocaleString()}
            </Button>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (data?.result.description) {
                setDialogVisible(true);
              }
            }}
          >
            <Text numberOfLines={4}>
              {data?.result.description ||
                `${data?.result.name}\nNo Description :(`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tags}>
        {data?.result.tags.map((tag) => (
          <Chip
            key={tag}
            icon="tag-text-outline"
            mode="outlined"
            style={styles.tag}
          >
            {tag}
          </Chip>
        ))}
      </View>

      <Portal>
        <Dialog
          visible={dialogVisible}
          style={styles.dialog}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>{data?.result.name}</Dialog.Title>
          <ScrollView style={styles.biggerPadding}>
            <Text selectable>{data?.result.description}</Text>
          </ScrollView>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => {
                setDialogVisible(false);
              }}
            >
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: "3.5%",
    paddingBottom: "2%",
  },
  headerRight: {
    flex: 1,
    marginLeft: "3%",
    alignItems: "flex-start",
  },
  dialog: {
    maxHeight: "80%",
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
  cover: {
    width: 150,
    height: 150,
    aspectRatio: 1,
  },
  tags: {
    marginHorizontal: "2%",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    margin: "1%",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
