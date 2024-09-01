import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth, useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { AuthStrategy } from '@/types/enums';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import Colors from '@/constants/Colors';

const content = [
  { title: "Identify Animals", icon: 'paw' },
  { title: "Identify Plants", icon: 'leaf' },
  { title: "Identify Bugs", icon: 'bug' },
  { title: "Identify Mushrooms", icon: 'seedling' },
  { title: "Identify Coins", icon: 'coins' },
  { title: "Identify Stones", icon: 'gem' },
  { title: "Identify Birds", icon: 'dove' },
  { title: "And More...", icon: 'ellipsis-h' },
];

const Login = () => {
  const { width } = useWindowDimensions();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const { userId } = useAuth();
  const router = useRouter();
  useWarmUpBrowser();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });

  const rotateValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    if (userId) {
      router.replace('/home');
    }

    rotateValue.value = withRepeat(
      withTiming(360, { duration: 10000, easing: Easing.linear }),
      -1,
      false
    );

    scaleValue.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, [userId, router]);

  const onSelectAuth = async (strategy: AuthStrategy) => {
    if (!signIn || !signUp) return null;

    const selectedAuth = {
      "oauth_google": googleAuth,
      "oauth_facebook": facebookAuth,
    }[strategy as "oauth_google" | "oauth_facebook"];

    if (!selectedAuth) return null;

    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code === 'external_account_exists';
      console.log("userExistsButNeedsToSignIn", userExistsButNeedsToSignIn)

console.log("userExistsButNeedsToSignIn", userExistsButNeedsToSignIn)
    if (userExistsButNeedsToSignIn) {
      console.log('Starting OAuth flow for existing user...');
      const res = await signIn.create({ transfer: true });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
         router.replace('/home');


      }
    }
    
    const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable';

    if (userNeedsToBeCreated) {
      console.log('Starting OAuth flow for new user...');
      const res = await signUp.create({
        transfer: true,
      });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
        router.replace('/home');


      }
    } else {
      try {
        console.log('Starting OAuth flow...');
        const { createdSessionId, signIn, signUp, setActive } = await selectedAuth();
        console.log('OAuth flow complete!');
        console.log('createdSessionId:', createdSessionId);
        console.log('signIn:', signIn);
        console.log('signUp:', signUp);
                console.log('OAuth success');
        console.log("Created session id:", createdSessionId);
        if (createdSessionId) {
          setActive!({ session: createdSessionId });
          router.replace('/home');
          console.log('OAuth success standard');
        }
      } catch (err) {
        console.error('OAuth error', err);
      }
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotateValue.value}deg` },
        { scale: scaleValue.value },
      ],
    };
  });

  const renderFeatureIcons = () => {
    return content.map((item, index) => (
      <Animated.View key={index} style={[styles.iconContainer, animatedStyle]}>
        <FontAwesome5 name={item.icon} size={30} color="#fff" />
        <Text style={styles.iconText}>{item.title}</Text>
      </Animated.View>
    ));
  };

  return (
    <ImageBackground 
      source={require('@/assets/icon.png')} 
      style={styles.container}
      blurRadius={10}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Identify Anything</Text>
            <Text style={styles.headerSubtitle}>Discover the world around you</Text>
          </View>

          <View style={styles.iconsContainer}>
            {renderFeatureIcons()}
          </View>

          <View style={styles.authContainer}>
            <Text style={styles.authTitle}>Welcome</Text>
            <Text style={styles.subtitle}>Choose a login method to continue</Text>
            
            <TouchableOpacity 
              style={[styles.btnOAuth, styles.googleBtn]}
              onPress={() => onSelectAuth('oauth_google')}
            >
              <Ionicons name="logo-google" size={24} style={styles.btnIcon} color={'#fff'} />
              <Text style={styles.btnText}>Continue with Google</Text>
            </TouchableOpacity>
             
            <TouchableOpacity 
              style={[styles.btnOAuth, styles.facebookBtn]}
              onPress={() => onSelectAuth('oauth_facebook')}
            >
              <Ionicons name="logo-facebook" size={24} style={styles.btnIcon} color={'#fff'} />
              <Text style={styles.btnText}>Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push({ pathname: '/login', params: { type: 'register' } })}
              style={[styles.btn, styles.btnDark]}
            >
              <Ionicons name="mail" size={24} style={styles.btnIcon} color={'#fff'} />
              <Text style={styles.btnText}>Sign up with email</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push({ pathname: '/login', params: { type: 'login' } })}
              style={[styles.btn, styles.btnOutline]}
            >
              <Text style={styles.btnOutlineText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  iconContainer: {
    alignItems: 'center',
    margin: 10,
  },
  iconText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
  authContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    gap: 15,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 15,
  },
  btnOAuth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  googleBtn: {
    backgroundColor: '#DB4437',
  },
  facebookBtn: {
    backgroundColor: '#4267B2',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnDark: {
    backgroundColor: Colors.grey,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: Colors.grey,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  btnOutlineText: {
    color: Colors.grey,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  btnIcon: {
    marginRight: 12,
  },
});

export default Login;