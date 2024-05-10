import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import Color from 'color';
import { BlurView } from 'expo-blur';
import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAppSelector } from '../hook';
import { selectBlurEnabled } from '../redux/slices';

export const BottomSheetPaper = ({
  bottomSheetRef,
  children,
}: PropsWithChildren<{
  bottomSheetRef: React.RefObject<BottomSheet>;
}>) => {
  const appTheme = useTheme();
  const experimentalBlurEnabled = useAppSelector(selectBlurEnabled);

  const backgroundColor = Color(appTheme.colors.surface)
    .fade(0.1).string();

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      backgroundStyle={
        experimentalBlurEnabled
          ? styles.transparent
          : { backgroundColor }
      }
      handleIndicatorStyle={{
        backgroundColor: appTheme.dark
          ? appTheme.colors.onSurfaceDisabled
          : appTheme.colors.backdrop
      }}
      snapPoints={['30%', '60%', '96%']}
      enablePanDownToClose
      android_keyboardInputMode="adjustResize"
      enableOverDrag={false} //防止与FlatList（ScrollView）冲突
      backgroundComponent={(props) =>
        <BlurView {...props}
          tint={appTheme.dark ? 'dark' : 'light'}
          experimentalBlurMethod={
            experimentalBlurEnabled ? 'dimezisBlurView' : 'none'
          }
        />
      }
      backdropComponent={(props) =>
        <BottomSheetBackdrop {...props}
          enableTouchThrough
        />
      }
    >
      <BottomSheetView style={styles.bottomView}>
        {children}
      </BottomSheetView>
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
