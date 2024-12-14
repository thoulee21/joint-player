import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
  BottomSheetModal,
  BottomSheetModalProvider,
  useBottomSheetSpringConfigs
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
} from 'react';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Handle from './AniSheetHandle';

export const BottomSheetPaper = forwardRef<
  BottomSheetModal,
  PropsWithChildren<{
    footer?: (props: BottomSheetFooterProps) => React.ReactNode
  }>
>(({
  children,
  footer
}, ref) => {
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

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        handleIndicatorStyle={{
          backgroundColor: appTheme.colors.outline
        }}
        enableDynamicSizing={false}
        snapPoints={['90%']}
        topInset={insets.top}
        enablePanDownToClose
        android_keyboardInputMode="adjustResize"
        enableOverDrag={false} //防止与FlatList（ScrollView）冲突
        animationConfigs={animationConfigs}
        backdropComponent={renderBackdrop}
        handleComponent={Handle}
        backgroundStyle={{
          backgroundColor: appTheme.colors.surface,
        }}
        footerComponent={footer}
      >
        {children}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});
