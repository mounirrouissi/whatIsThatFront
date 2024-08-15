import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';
import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import { Drawer } from 'expo-router/drawer';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ImagePickerComponent from './(tabs)/camera';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return( 
    
    <ClerkProvider publishableKey={publishableKey}>
  <RootLayoutNav />
</ClerkProvider>

  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const Drawer = createDrawerNavigator();
  const Tabs = createBottomTabNavigator();

  function TabsNavigator() {
    return (
      <Tabs.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            paddingTop: 5,
            backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
            borderTopWidth: 0,
            elevation: 0,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#8e8e93' : '#3c3c43',
          tabBarShowLabel: false,
        })}
      >
        <Tabs.Screen
          name="home"
          component={require('./(tabs)/index').default}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <FontAwesome name="home" size={size} color={focused ? '#007AFF' : color} />
            ),
          }}
        />
        <Tabs.Screen
          name="camera"
          component={ImagePickerComponent}
          options={{
            headerShown: false,
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                style={styles.cameraButton}
                onPress={props.onPress}
              >
                <View style={styles.cameraIconContainer}>
                  <FontAwesome name="camera" size={25} color="#ffffff" />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          component={require('./(drawer)/myObservs').default}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <FontAwesome name="amazon" size={size} color={focused ? '#007AFF' : color} />
            ),
          }}
        />
      </Tabs.Navigator>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator>
        <Drawer.Screen
          name="index"
          component={TabsNavigator}
          options={{
            drawerLabel: 'Home',
            title: 'Welcome',
            drawerIcon: ({size, color}) => <Ionicons name='home-outline' size={size} color={color}/>
          }}
        />
        {/* Add more drawer items as needed */}
      </Drawer.Navigator>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});