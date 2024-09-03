import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Home from './home';
import camera from './camera';
import Observations from './Observations';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontFamily: 'Poppins',
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: { 
          backgroundColor: '#121212',
          height: 60,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="home" size={24} color={focused ? Colors.primary : color} />
          ),
          title: "Home",
          headerShown: false,
        }}
      />
      
      <Tab.Screen
        name="camera"
        component={camera}
        options={({ navigation }) => ({
          tabBarLabel: 'Identify',
          tabBarLabelStyle: { display: 'none' },
          headerShown: false,
          tabBarStyle: { display: 'none' },
          
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => navigation.navigate('camera')}
            />
          ),
          tabBarIcon: ({ focused, color }) => (
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              height: 68, 
              width: 68, 
              borderRadius: 34, 
              backgroundColor: Colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Ionicons name="camera" size={32} color="white" />
            </View>
          ),
        })}
      />

      <Tab.Screen
        name="Observations"
        component={Observations}
        options={{
          tabBarLabel: "Observations",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="book" size={24} color={focused ? Colors.primary : color} />
          ),
          title: "Observations",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}