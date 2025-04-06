import React, { memo, PropsWithChildren } from "react";
import { Platform, ScrollView, View } from "react-native";

export const ListWrapper = memo(
  ({
    children,
    bottomViewHeight = 220,
  }: PropsWithChildren<{ bottomViewHeight?: number }>) => {
    const height = Platform.OS === "android" ? bottomViewHeight : 0;

    return (
      <ScrollView>
        {children}
        <View style={{ height }} />
      </ScrollView>
    );
  },
);
