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

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
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
        tabBarLabelStyle: {
          fontFamily: 'Poppins', // Apply Poppins font here
          fontSize: 12, 
        },
        tabBarStyle: { 
          backgroundColor: '#121212', // Dark background for tab bar
          height: 60, // Set the height of the tab bar
        },
      }}
    >
      
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="earth" size={24} color={focused ? Colors.primary : color} />
          ),
          title: "Home",
          headerShown: false,
        }}
      />
      
    

        <Tab.Screen
        name="camera"
        component={camera}
        options={({ navigation }) => ({
          tabBarLabel: 'Identify That Thing',
          tabBarLabelStyle: { display:'none', fontFamily: 'Poppins', fontSize: 12,flex: 1, alignItems: 'center', justifyContent: 'center' },
          headerShown: false,
          tabBarStyle: { display: 'none' },
          
          tabBarButton: (props) => (
            <Pressable
              {...props}
              onPress={() => navigation.navigate('camera')}
            />
          ),
          tabBarIcon: ({ focused, color }) => (
            <View style={{ position: 'absolute', top: -20, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ backgroundColor: "green", borderRadius: 30, padding: 10 }}>
                <Ionicons name="camera" size={24} color={focused ? Colors.primary : "white"} />
              </View>
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
          tabBarStyle:null,
        }}
      />
    </Tab.Navigator>
  );
}