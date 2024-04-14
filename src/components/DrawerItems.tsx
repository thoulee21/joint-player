import { DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Drawer } from 'react-native-paper';

export function DrawerItems({ navigation }: { navigation: any }) {
  const [drawerItemIndex, setDrawerItemIndex] = useState(0);

  return (
    <DrawerContentScrollView>
      <Drawer.Section title="Pages">
        <Drawer.Item
          label="Player"
          icon={drawerItemIndex === 0 ? "play-circle" : "play-circle-outline"}
          active={drawerItemIndex === 0}
          onPress={() => {
            navigation.navigate('Player');
            setDrawerItemIndex(0);
          }}
        />
        <Drawer.Item
          label="Settings"
          icon={drawerItemIndex === 1 ? "cog" : "cog-outline"}
          active={drawerItemIndex === 1}
          onPress={() => {
            navigation.navigate('Settings');
            setDrawerItemIndex(1);
          }}
        />
      </Drawer.Section>
    </DrawerContentScrollView>
  );
}
