import { AppState, type AppStateStatus } from "react-native";

export const initFocus = (callback: () => void) => {
  let appState = AppState.currentState;

  const onAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      /* 如果正在从后台或非 active 模式恢复到 active 模式 */
      appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      callback();
    }
    appState = nextAppState;
  };

  // 订阅 app 状态更改事件
  const subscription = AppState.addEventListener("change", onAppStateChange);

  return () => {
    subscription.remove();
  };
};
