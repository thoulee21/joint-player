import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';

export const BottomSheetPaper = ({
  bottomSheetRef,
  children,
}: PropsWithChildren<{ bottomSheetRef: React.RefObject<BottomSheet> }>) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      backgroundStyle={styles.transparent}
      handleIndicatorStyle={styles.transparent}
      snapPoints={['99%']}
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
