import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import React from 'react';
import { ClerkProvider, useAuth, useClerk } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet, Image, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SupabaseProvider } from '@/context/SupabaseContext';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from './(auth)/auth';
import Home from './(app)/home/home';
import { FullWindowOverlay } from 'react-native-screens';
import { Stack } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

export { ErrorBoundary } from 'expo-router';

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SupabaseProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </SupabaseProvider>
    </ClerkProvider>
  );
}


function CustomDrawerContent(props: any) {
  const { signOut, user } = useClerk();

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', padding: 20 }}>
        <Image source={{ uri: user?.imageUrl }} style={{ width: 80, height: 80, borderRadius: 40 }} />
        <Text style={{ marginTop: 10, fontSize: 16 }}>{user?.fullName}</Text>
        <Text style={{ color: 'gray' }}>{user?.emailAddresses[0].emailAddress}</Text>
      </View>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => signOut()}
        style={{ marginTop: 'auto', marginBottom: 20 }}
      />
    </DrawerContentScrollView>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = React.useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = React.useState(false);


  useEffect(() => {
    async function checkOnboarding() {
      const status = await AsyncStorage.getItem('onboardingStatus');
      setHasCompletedOnboarding(status === 'completed');
      setHasCheckedOnboarding(true);
    }
    checkOnboarding();
    if (!isLoaded || !hasCheckedOnboarding) return;

    if (!hasCompletedOnboarding) {
      router.replace('/onboarding');
    } else if (!isSignedIn) {
      router.replace('/(auth)/auth');
    } else if (segments[0] !== '(app)') {
      router.replace('/home');
    }
  }, [isLoaded]);

  // Ensure Slot is rendered to avoid the "navigate before mounting" error

  const Drawer = createDrawerNavigator();
  const Stack = createNativeStackNavigator();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
      {isSignedIn ? (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
          <Drawer.Screen name="(app)" component={Home} 
            options={{
              headerStyle:{height: 'auto'},
            }}
          />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen 
            name="(auth)/login" 
            component={Login} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
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
