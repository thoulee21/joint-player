import { DrawerToggleButton } from "@react-navigation/drawer";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { Appbar, Portal, useTheme } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { BlurBackground } from "../components/BlurBackground";
import { ConfirmClearFavsDialog } from "../components/ConfirmClearFavsDialog";
import { FavsList } from "../components/FavsList";
import { PlayControlsFAB } from "../components/PlayControlsFAB";
import { TracksHeader } from "../components/TracksHeader";
import { useAppDispatch, useAppSelector } from "../hook";
import { favs, setQueueAsync } from "../redux/slices";

export function Favs() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const appTheme = useTheme();

  const favsValue = useAppSelector(favs);
  const [dialogVisible, setDialogVisible] = useState(false);

  const playAll = useCallback(async () => {
    await dispatch(setQueueAsync(favsValue));
    await TrackPlayer.play();
  }, [dispatch, favsValue]);

  const showConfirmDialog = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.notificationWarning);
    setDialogVisible(true);
  }, []);

  return (
    <Portal.Host>
      <BlurBackground>
        <Appbar.Header style={styles.appbar}>
          <DrawerToggleButton tintColor={appTheme.colors.onSurface} />
          <Appbar.Content title={t("drawer.item.favs.title")} />

          <Appbar.Action
            icon="delete-forever-outline"
            disabled={favsValue.length === 0}
            onPress={showConfirmDialog}
          />
        </Appbar.Header>

        <Portal.Host>
          <TracksHeader onPress={playAll} length={favsValue.length} />
          <FavsList />
        </Portal.Host>

        <ConfirmClearFavsDialog
          visible={dialogVisible}
          hideDialog={() => setDialogVisible(false)}
        />

        <PlayControlsFAB />
      </BlurBackground>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  appbar: {
    backgroundColor: "transparent",
  },
  loading: {
    marginTop: "50%",
  },
});
