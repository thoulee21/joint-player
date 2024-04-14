import React from "react";
import { StyleSheet, View } from "react-native";
import { Switch } from "react-native-paper";

export const RightSwitch = ({ value, disabled = false, ...props }:
    {
        value: boolean,
        disabled?: boolean
    }
) => {
    return (
        <View pointerEvents="none" {...props}>
            <Switch
                value={value}
                style={styles.switch}
                disabled={disabled}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    switch: {
        marginRight: -15,
    }
});