import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import Color from 'color';
import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export const BottomSheetPaper = ({
  bottomSheetRef,
  children,
}: PropsWithChildren<{ bottomSheetRef: React.RefObject<BottomSheet> }>) => {
  const appTheme = useTheme();

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      backgroundStyle={styles.transparent}
      handleIndicatorStyle={{
        backgroundColor:
          Color(appTheme.colors.onSurface)
            .fade(0.2).string()
      }}
      snapPoints={['97%']}
      enablePanDownToClose
      android_keyboardInputMode="adjustResize"
      enableOverDrag={false} //防止与FlatList（ScrollView）冲突
    >
      <BottomSheetView style={styles.bottomView}>{children}</BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    height: '100%',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
