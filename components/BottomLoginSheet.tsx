import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { AuthStrategy } from '@/types/enums';
import { useAuth, useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomLoginSheet = () => {
  const { bottom } = useSafeAreaInsets();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const { userId } = useAuth();
  console.log("userId:", userId);

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: facebookAuth } = useOAuth({ strategy: 'oauth_facebook' });
  const router = useRouter();
  useWarmUpBrowser()

  useEffect(() => {
    if (userId) {
      router.replace('/(app)/home');
    }
  }, [userId, router]);
  const onSelectAuth = async (strategy: AuthStrategy) => {
    if (!signIn || !signUp) return null;

    const selectedAuth = {
      "oauth_google": googleAuth,
      "oauth_facebook": facebookAuth,
    }[strategy as "oauth_google" | "oauth_facebook"];

    if (!selectedAuth) return null;

    // https://clerk.com/docs/custom-flows/oauth-connections#o-auth-account-transfer-flows
    // If the user has an account in your application, but does not yet
    // have an OAuth account connected to it, you can transfer the OAuth
    // account to the existing user account.
    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === 'transferable' &&
      signUp.verifications.externalAccount.error?.code === 'external_account_exists';
console.log("userExistsButNeedsToSignIn", userExistsButNeedsToSignIn)
    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
         router.replace('/(app)/home');


      }
    }
    
    const userNeedsToBeCreated = signIn.firstFactorVerification.status === 'transferable';

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      });

      if (res.status === 'complete') {
        setActive({
          session: res.createdSessionId,
        });
        router.replace('/(app)/home');


      }
    } else {
      // If the user has an account in your application
      // and has an OAuth account connected to it, you can sign them in.
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
          router.replace('/(app)/home');
          console.log('OAuth success standard');
        }
      } catch (err) {
        console.error('OAuth error', err);
      }
    }
  };
  const handleSignUp = () => {
    router.push({
      pathname: '/login',
      params: { type: 'register' },
    });
  };

  const handleLogin = () => {
    router.push({
      pathname: '/login',
      params: { type: 'login' },
    });
  };




 
  return (
    <View style={[styles.LoginContainer, { paddingBottom: bottom }]}>
      <Text style={styles.LoginTitle}>Welcome</Text>
      <Text style={styles.subtitle}>Choose a login method to continue</Text>
      
      <TouchableOpacity 
        style={[defaultStyles.btn, styles.btnOAuth, styles.googleBtn]}
        onPress={() => onSelectAuth('oauth_google')}
      >
        <Ionicons name="logo-google" size={20} style={styles.btnIcon} color={'#fff'} />
        <Text style={styles.btnText}>Continue with Google</Text>
      </TouchableOpacity>
       
      <TouchableOpacity 
        style={[defaultStyles.btn, styles.btnOAuth, styles.facebookBtn]}
        onPress={() => onSelectAuth('oauth_facebook')}
      >
        <Ionicons name="logo-facebook" size={20} style={styles.btnIcon} color={'#fff'} />
        <Text style={styles.btnText}>Continue with Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignUp} style={[defaultStyles.btn, styles.btnDark]}>
        <Ionicons name="mail" size={20} style={styles.btnIcon} color={'#fff'} />
        <Text style={styles.btnText}>Sign up with email</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={[defaultStyles.btn, styles.btnOutline]}>
        <Text style={styles.btnOutlineText}>Log in</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  LoginContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 26,
    gap: 16,
  },
  LoginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  btnOAuth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  googleBtn: {
    backgroundColor: '#DB4437',
  },
  facebookBtn: {
    backgroundColor: '#4267B2',
  },
  btnDark: {
    backgroundColor: Colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: Colors.grey,
    paddingVertical: 12,
    borderRadius: 8,
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
    marginRight: 10,
  },
});

export default BottomLoginSheet;