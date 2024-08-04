import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/customDrawerContent';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={CustomDrawerContent} >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'Welcome',
          }}
        />
        <Drawer.Screen
          name="profile" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Profile',
            title: 'My Profile',
            drawerIcon : ({size,color})=>{  return <Ionicons name='people-outline' size={size} color={color}/>}
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
