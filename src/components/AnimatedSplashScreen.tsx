import LottieView from "lottie-react-native";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  Animated,
  Appearance,
  DeviceEventEmitter,
  Easing,
  StatusBar,
  StyleSheet,
} from "react-native";
import { THEME_COLOR } from "../utils/constants";
import { rootLog } from "../utils/logger";

export const REMAINING_DURATION = 1000;

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const AnimatedSplashScreen = ({ children }: PropsWithChildren) => {
  const [isLoadEnd, setIsLoadEnd] = useState(false);
  const [isAniDone, setIsAniDone] = useState(false);

  const lottieRef = useRef<LottieView>(null);
  const loadingProgress = useRef(new Animated.Value(0));
  const opacity = useRef(new Animated.Value(1));

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("loadEnd", () => {
      setIsLoadEnd(true);
    });

    StatusBar.setBarStyle(
      Appearance.getColorScheme() === "dark" ? "light-content" : "dark-content",
    );

    return () => {
      sub.remove();
    };
  }, []);

  useEffect(() => {
    if (!isLoadEnd) {
      Animated.loop(
        Animated.timing(loadingProgress.current, {
          toValue: 64 / 147, // stage 1 / total stage
          duration: 1000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      Animated.timing(loadingProgress.current, {
        isInteraction: true,
        toValue: 1,
        duration: REMAINING_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          DeviceEventEmitter.emit("aniDone");
        }, 25);
        // 动画完成后开始淡出
        Animated.timing(opacity.current, {
          toValue: 0,
          duration: 350,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start(() => {
          setIsAniDone(true);
          rootLog.info("animation done, loading end");
        });
      });
    }
  }, [loadingProgress, opacity, isLoadEnd]);

  const colorFilters = useMemo(
    () => [
      { keypath: "welcome 1", color: THEME_COLOR },
      { keypath: "welcome 3", color: THEME_COLOR },
      { keypath: "ball", color: THEME_COLOR },
      {
        keypath: "welcome 2",
        color: Appearance.getColorScheme() === "dark" ? "white" : "black",
      },
    ],
    [],
  );

  return (
    <>
      {children}
      {!isAniDone && (
        <Animated.View
          style={[
            styles.rootView,
            styles.aniView,
            { opacity: opacity.current },
          ]}
        >
          <AnimatedLottieView
            ref={lottieRef}
            source={require("../assets/animations/welcome.json")}
            progress={loadingProgress.current}
            colorFilters={colorFilters}
            style={styles.rootView}
          />
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  rootView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    flex: 1,
    backgroundColor: Appearance.getColorScheme() === "dark" ? "black" : "white",
  },
  aniView: {
    zIndex: 2,
  },
});
