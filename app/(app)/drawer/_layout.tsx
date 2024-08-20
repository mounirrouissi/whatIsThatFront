import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/customDrawerContent';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'home/camera', // Hide header for camera tab
        swipeEnabled: route.name !== 'home/camera', // Disable drawer swipe for camera tab
        drawerType: route.name === 'home/camera' ? 'front' : 'slide', // Set drawer type to 'front' for camera tab
      })}
      drawerContent={(props) => {
        const filteredProps = {
          ...props,
          state: {
            ...props.state,
            routeNames: props.state.routeNames.filter(
              (routeName) => routeName !== 'home/camera'
            ),
          },
        };
        return (
          <DrawerContentScrollView {...filteredProps}>
            <CustomDrawerContent {...filteredProps} />
          </DrawerContentScrollView>
        );
      }}
      
      
      
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          
          options={{
            drawerLabel: '',
            title: 'Welcome',
            headerShown: false,
            drawerIcon: ({size, color}) => { return <Ionicons name='home-outline' size={size} color={color}/> }
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
        <Drawer.Screen
          name="home/camera"
          options={{
            drawerLabel: () => null,
            drawerItemStyle: { height: 0 },
            drawerIcon: () => null
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
