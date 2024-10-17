import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurBackground } from "../components/BlurBackground";
import { ANIMATIONS, LottieAnimation } from "../components/LottieAnimation";

const BottomTab = createMaterialTopTabNavigator();

export const AniGallery = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

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
            <Appbar.Header style={styles.transparent}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Animation Gallery" />
            </Appbar.Header>

            <BottomTab.Navigator
                backBehavior="none"
                tabBarPosition="bottom"
                sceneContainerStyle={styles.transparent}
                screenOptions={{
                    tabBarStyle: [styles.tabBarStyle, {
                        marginBottom: insets.bottom
                    }]
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
    tabBarStyle: {
        height: 2
    }
})