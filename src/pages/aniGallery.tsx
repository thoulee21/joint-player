import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurBackground } from "../components/BlurBackground";
import { ANIMATIONS, LottieAnimation } from "../components/LottieAnimation";

const BottomTab = createMaterialTopTabNavigator();

export const AniGallery = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [isTransparent, setIsTransparent] = useState(true);

    const renderAniPage = useCallback((name: keyof typeof ANIMATIONS) => {
        return () => (
            <LottieAnimation
                animation={name}
                caption={name.toLocaleUpperCase()}
            />
        )
    }, []);

    const AniPages = useMemo(() =>
        Object.keys(ANIMATIONS).map((key, index) => (
            <BottomTab.Screen
                key={index}
                name={key}
                component={renderAniPage(key as keyof typeof ANIMATIONS)}
                options={{ tabBarShowLabel: false }}
            />
        )), [ANIMATIONS]);

    return (
        <BlurBackground>
            <Appbar.Header style={isTransparent && styles.transparent}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Animation Gallery" />
                <Appbar.Action
                    icon={isTransparent ? 'format-color-fill' : 'material-design'}
                    onPress={() => setIsTransparent(!isTransparent)}
                />
            </Appbar.Header>

            <BottomTab.Navigator
                backBehavior="none"
                tabBarPosition={isTransparent ? 'bottom' : 'top'}
                sceneContainerStyle={isTransparent && styles.transparent}
                screenOptions={{
                    tabBarStyle: [styles.tabBarIndicator, {
                        marginBottom: insets.bottom
                    }],
                    tabBarIndicatorStyle: styles.tabBarIndicator
                }}
            >
                {AniPages}
            </BottomTab.Navigator>
        </BlurBackground>
    );
};

const styles = StyleSheet.create({
    transparent: {
        backgroundColor: 'transparent'
    },
    tabBarIndicator: {
        height: 3
    }
})