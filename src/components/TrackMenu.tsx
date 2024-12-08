import { useNavigation } from '@react-navigation/native';
import React, {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';
import { StatusBar } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { IconButton, Menu } from 'react-native-paper';

const MenuContext = createContext<{
  onPostPressed: () => void;
  navigation: any;
}>({
  onPostPressed: () => { },
  navigation: null,
});

export const useMenuContext = () => {
  return useContext(MenuContext);
};

export function TrackMenu(props: PropsWithChildren) {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      elevation={1}
      onDismiss={closeMenu}
      statusBarHeight={StatusBar.currentHeight}
      anchor={
        <IconButton
          {...props}
          size={24}
          icon="dots-vertical"
          onPress={() => {
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectHeavyClick
            );
            openMenu();
          }}
        />
      }
    >
      <MenuContext.Provider value={{
        onPostPressed: closeMenu,
        navigation
      }}>
        {props.children}
      </MenuContext.Provider>
    </Menu>
  );
}
