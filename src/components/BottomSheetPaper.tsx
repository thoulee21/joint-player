import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import React, { PropsWithChildren, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { BlurBackground } from './BlurBackground';

export const BottomSheetPaper = ({
  bottomSheetRef,
  children,
}: PropsWithChildren<{
  bottomSheetRef: React.RefObject<BottomSheet>;
}>) => {
  const appTheme = useTheme();

  const renderBackground = useCallback((props: any) => (
    <View {...props}>
      <BlurBackground />
    </View>
  ), []);

  const renderBackDrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props}
        enableTouchThrough
      />
    ), []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      handleIndicatorStyle={{
        backgroundColor: appTheme.dark
          ? appTheme.colors.onSurfaceDisabled
          : appTheme.colors.backdrop,
      }}
      snapPoints={['35%', '90%']}
      enablePanDownToClose
      android_keyboardInputMode="adjustResize"
      enableOverDrag={false} //防止与FlatList（ScrollView）冲突
      backgroundComponent={renderBackground}
      backdropComponent={renderBackDrop}
    >
      <BottomSheetView style={styles.bottomView}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    flex: 1,
  },
});
