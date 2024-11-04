import BottomSheet, {
  BottomSheetView,
  type BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from './BlurBackground';

export const BottomSheetPaper = forwardRef<
  BottomSheet, PropsWithChildren
>((
  { children }, ref
) => {
  const appTheme = useTheme();
  const insets = useSafeAreaInsets();

  const renderBackground = useCallback((
    props: BottomSheetBackgroundProps
  ) => (
    <View {...props}>
      <BlurBackground />
    </View>
  ), []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      enableDynamicSizing={false}
      snapPoints={['100%']}
      handleIndicatorStyle={{
        backgroundColor: appTheme.dark
          ? appTheme.colors.onSurfaceDisabled
          : appTheme.colors.backdrop,
      }}
      bottomInset={insets.bottom}
      topInset={insets.top}
      enablePanDownToClose
      android_keyboardInputMode="adjustResize"
      enableOverDrag={false} //防止与FlatList（ScrollView）冲突
      backgroundComponent={renderBackground}
    >
      <BottomSheetView style={styles.root}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
  },
});
