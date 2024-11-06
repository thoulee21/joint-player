import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import React, { forwardRef, PropsWithChildren, useCallback } from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Handle from './AniSheetHandle';
import { BlurBackground } from './BlurBackground';

export const BottomSheetPaper = forwardRef<
  BottomSheet, PropsWithChildren
>((
  { children }, ref
) => {
  const appTheme = useTheme();
  const insets = useSafeAreaInsets();

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const renderBackground = useCallback((
    props: BottomSheetBackgroundProps
  ) => (
    <View {...props}>
      <BlurBackground />
    </View>
  ), []);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      handleIndicatorStyle={{
        backgroundColor: appTheme.colors.outline
      }}
      enableDynamicSizing={false}
      snapPoints={['50%', '80%']}
      bottomInset={insets.bottom}
      topInset={insets.top}
      enablePanDownToClose
      android_keyboardInputMode="adjustResize"
      enableOverDrag={false} //防止与FlatList（ScrollView）冲突
      backgroundComponent={renderBackground}
      animationConfigs={animationConfigs}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
    >
      {children}
    </BottomSheet>
  );
});
