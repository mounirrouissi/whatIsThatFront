import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Slot, Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';
import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Drawer } from 'expo-router/drawer';
import * as SecureStore from 'expo-secure-store';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ImagePickerComponent from './(app)/home/camera';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SupabaseProvider } from '@/context/SupabaseContext';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string

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

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

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
    
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>

          <SupabaseProvider>
        
    <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
    </GestureHandlerRootView>
        
          </SupabaseProvider>
      </ClerkProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const Drawer = createDrawerNavigator();
  const Tabs = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const hasCompletedOnboarding =  AsyncStorage.getItem('onboardingStatus');
  useEffect(() => {
    if (!isLoaded) return;
    
    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else if (!isSignedIn ) {
      router.replace('/(auth)/auth');
    } else if (segments[0] !== '(app)') {
      router.replace('/home');
     }
  }, []);
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }




  

  return (
    <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
      <Slot/>
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