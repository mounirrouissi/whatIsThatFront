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

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ImagePickerComponent from './(tabs)/camera';

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
      <Tabs.Navigator>
        <Tabs.Screen name="Tab1" component={ImagePickerComponent} />
        <Tabs.Screen name="Tab2" component={ImagePickerComponent} />
        {/* Add more tabs as needed */}
      </Tabs.Navigator>
    );
  }

  return (
   
   
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
   <Drawer.Navigator>
        <Drawer.Screen name="(drawer)" component={TabsNavigator} options={{ headerShown: false }} />
        {/* Add more drawer items as needed */}
      </Drawer.Navigator>
    
    
    
    
    
    </ThemeProvider>


  );
}
