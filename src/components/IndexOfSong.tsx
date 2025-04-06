import React from "react";
import { Text, useTheme } from "react-native-paper";
import type { Style } from "react-native-paper/lib/typescript/components/List/utils";

export const IndexOfSong = ({
  style: leftStyle,
  index,
}: {
  style?: Style;
  index: number;
}) => {
  const appTheme = useTheme();
  return (
    <Text
      variant="titleLarge"
      style={[
        leftStyle,
        {
          color: appTheme.dark
            ? appTheme.colors.onSurfaceDisabled
            : appTheme.colors.backdrop,
        },
      ]}
    >
      {index + 1}
    </Text>
  );
};
