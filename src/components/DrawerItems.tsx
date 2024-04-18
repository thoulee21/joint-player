import { DrawerContentScrollView } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Badge, Drawer, useTheme } from 'react-native-paper';

const Dot = ({ color }: { color: string }) => (
  <Badge
    size={10}
    style={{
      backgroundColor: color,
      alignSelf: 'center'
    }}
  />
)

export function DrawerItems({ navigation }: { navigation: any }) {
  const appTheme = useTheme();
  const [drawerItemIndex, setDrawerItemIndex] = useState(0);

  return (
    <BlurView
      style={styles.root}
      tint={appTheme.dark
        ? 'systemUltraThinMaterialDark'
        : 'systemUltraThinMaterialLight'}
      experimentalBlurMethod="dimezisBlurView"
    >
      <DrawerContentScrollView>
        <Drawer.Section title="Pages">
          <Drawer.Item
            label="Player"
            icon={drawerItemIndex === 0 ? "play-circle" : "play-circle-outline"}
            style={styles.transparent}
            right={(props) => (
              drawerItemIndex === 0 ? <Dot {...props} /> : null
            )}
            active={drawerItemIndex === 0}
            onPress={() => {
              navigation.navigate('Player');
              setDrawerItemIndex(0);
            }}
          />
          <Drawer.Item
            label="Settings"
            icon={drawerItemIndex === 1 ? "cog" : "cog-outline"}
            style={styles.transparent}
            right={(props) => (
              drawerItemIndex === 1 ? <Dot {...props} /> : null
            )}
            active={drawerItemIndex === 1}
            onPress={() => {
              navigation.navigate('Settings');
              setDrawerItemIndex(1);
            }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  transparent: {
    backgroundColor: 'transparent'
  }
});