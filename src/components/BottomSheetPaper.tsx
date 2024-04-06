import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetView
} from "@gorhom/bottom-sheet";
import React, { PropsWithChildren, useCallback } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export const BottomSheetPaper = ({ bottomSheetRef, children }:
    PropsWithChildren<{ bottomSheetRef: React.RefObject<BottomSheet> }>
) => {
    const appTheme = useTheme();

    const renderBackdrop = useCallback(
        (backdropProps: BottomSheetBackdropProps) =>
            <BottomSheetBackdrop
                {...backdropProps}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />, []);

    return <BottomSheet
        ref={bottomSheetRef}
        index={2}
        backgroundStyle={{ backgroundColor: appTheme.colors.background }}
        handleIndicatorStyle={{ backgroundColor: appTheme.colors.primary }}
        snapPoints={['40%', '80%', '97%']}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        android_keyboardInputMode="adjustResize"
        enableOverDrag={false}//防止与FlatList（ScrollView）冲突
    >
        <BottomSheetView style={styles.bottomView}>
            {children}
        </BottomSheetView>
    </BottomSheet>;
};

const styles = StyleSheet.create({
    bottomView: {
        height: '100%',
    },
});