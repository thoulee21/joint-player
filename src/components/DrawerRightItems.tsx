import React from 'react';
import { Text, useTheme } from 'react-native-paper';
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
