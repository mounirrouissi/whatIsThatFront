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
import { View, ActivityIndicator, StyleSheet, Image, Text, Linking } from 'react-native';
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
import EncyclopediaEntryDetail from './(app)/EncyclopediaEntryDetail';
import EncyclopediaEntries from './(app)/EncyclopediaEntries';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabLayout from './(app)/home/_layout';



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
    Poppins: require('@/assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('@/assets/fonts/Poppins-Bold.ttf'),

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
    <DrawerContentScrollView {...props}
    contentContainerStyle={{ flex: 1, backgroundColor: '#f8f8f8' }}
    >
      <View style={{ alignItems: 'center', padding: 24, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' }}>
        <Image source={{ uri: user?.imageUrl }} style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#4a90e2' }} />
        <Text style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold' }}>{user?.fullName}</Text>
        <Text style={{ color: '#666666', fontSize: 14 }}>{user?.emailAddresses[0].emailAddress}</Text>
      </View>
      <View style={{ flex: 1, paddingTop: 16 }}>
        <DrawerItemList {...props} />
        <DrawerItem 
          label="Privacy Policy"
          onPress={() => Linking.openURL('https://docs.spring.io/spring-ai/reference/1.0/api/chat/vertexai-gemini-chat.html')} 
          icon={({ color, size }) => (
            <Ionicons name="document-text" size={size} color="#4a90e2" />
          )}
          labelStyle={{ color: '#333333' }}
        /> 
      </View>
      <DrawerItem
        label="Logout"
        onPress={() => signOut()}
        style={{ marginBottom: 24, borderTopWidth: 1, borderTopColor: '#e0e0e0', paddingTop: 16 }} 
        icon={({ color, size }) => (
          <Ionicons name="log-out" size={size} color="#e74c3c" />
        )}
        labelStyle={{ color: '#e74c3c', fontWeight: 'bold' }}
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
  const Tab = createBottomTabNavigator();


  function HomeTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen 
          name="HomeTab" 
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <ThemeProvider value={colorScheme === 'light' ? DefaultTheme : DefaultTheme}>
      {isSignedIn ? (
        <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
           

          <Drawer.Screen name="(app)/home" component={TabLayout} // Render the TabLayout here
            options={{
              headerStyle:{height: 'auto'},
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
           <Drawer.Screen name="(app)/EncyclopediaEntryDetail"  component={EncyclopediaEntryDetail} 
           options={{
            headerStyle:{height: 'auto'},
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
           }}
           /> 
              <Drawer.Screen name="(app)/EncyclopediaEntries"  component={EncyclopediaEntries} 
           options={{
            headerStyle:{height: 'auto'},
            drawerIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
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
  // Updated styles with more visual appeal
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
    backgroundColor: '#121212', 
    // Add padding to the top of the container 
    // for a more spacious look
    padding: 10, 
  },
  header: {
    alignItems: 'baseline',
    marginBottom: 20,
    // Add padding for more visual space 
    // around the header elements
    padding: 10, 
  },
  title: {
    fontSize: 28,
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    fontFamily: 'Poppins', // Apply Poppins font here
  },
  list: {
    width: '100%',
  },
  item: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
    borderRadius: 10,
    marginHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84, 
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  itemContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins', // Apply Poppins font here
  },
  itemDate: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: 'Poppins', // Apply Poppins font here
  },
  skeletonLine: {
    height: 20,
    marginBottom: 6,
    borderRadius: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 20,
  },
  userInfo: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 15,
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Poppins', // Apply Poppins font here
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 15,
    borderRadius: 30,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userIdentifiedDate: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
    fontFamily: 'Poppins', // Apply Poppins font here
  },
});