import { Drawer } from 'expo-router/drawer';
import { Tabs } from 'expo-router/tabs';
import React from 'react';

export default function AppLayout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Home",
          title: ""
        }}
      />
      <Drawer.Screen
        name="drawer"
        options={{
          drawerLabel: "Settings",
          title: "Settings"
        }}
      />
    </Drawer>
  );
}