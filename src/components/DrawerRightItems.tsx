import { useUpdates } from 'expo-updates';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../hook/reduxHooks';
import { favs } from '../redux/slices/favs';

export const FavCount = () => {
  const favorites = useAppSelector(favs);
  const appTheme = useTheme();

  return (
    <Text
      variant="labelLarge"
      style={{ color: appTheme.colors.outline }}
    >
      {favorites.length}
    </Text>
  );
};

export const UpdateBadge = () => {
  const { isUpdatePending } = useUpdates();
  return isUpdatePending && (
    <Badge
      visible
      size={8}
      style={[
        styles.badge,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'center',
  },
});
