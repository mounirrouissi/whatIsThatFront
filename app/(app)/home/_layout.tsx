import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';

import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarLabelStyle: {
          fontFamily: 'mon-sb',
        },
      }}>
      
      
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ size, color }) => <Ionicons name="search" size={size} color={color} />,
          headerShown: false, // Ensure header is shown

        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          tabBarLabel: 'IdentifyyThatThing',
          tabBarLabelStyle: { fontFamily: 'Roboto', fontSize: 14 },
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <View style={{ position: 'absolute', top: -20, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ backgroundColor: "green", borderRadius: 30, padding: 10 }}>
                <Ionicons name="camera" size={size} color="white" />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="enclypodia"
        options={{
          tabBarLabel: 'enclypodia',
          headerShown: false,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="airplane" size={size} color={color} />
          ),
          


        }}
      />
    </Tabs>
  );
}
